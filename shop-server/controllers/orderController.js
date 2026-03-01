const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const ordersCollection = 'orders';
const DELIVERY_CHARGE = 80;

function normalizeOrder(body = {}) {
  const normalizedItems = Array.isArray(body.items)
    ? body.items
        .map((item) => ({
          productId: String(item.productId || '').trim(),
          name: String(item.name || '').trim(),
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          imageUrl: String(item.imageUrl || '').trim(),
        }))
        .filter((item) => item.productId && item.name && item.price > 0 && item.quantity > 0)
    : [];

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = normalizedItems.length ? DELIVERY_CHARGE : 0;
  const totalAmount = subtotal + deliveryCharge;

  return {
    customerName: String(body.customerName || '').trim(),
    customerPhone: String(body.customerPhone || '').trim(),
    shippingAddress: String(body.shippingAddress || '').trim(),
    notes: String(body.notes || '').trim(),
    items: normalizedItems,
    subtotal,
    deliveryCharge,
    totalAmount,
  };
}

function validateOrder(order) {
  if (!order.customerName) return 'Customer name is required';
  if (!order.customerPhone) return 'Customer phone is required';
  if (!order.shippingAddress) return 'Shipping address is required';
  if (!order.items.length) return 'Order must contain at least one item';
  return null;
}

async function createOrder(req, res) {
  try {
    const normalizedOrder = normalizeOrder(req.body);
    const validationError = validateOrder(normalizedOrder);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const db = getDB();
    const now = new Date();
    const orderId = new ObjectId();
    const orderNumber = `PF-${orderId.toString().slice(-10).toUpperCase()}`;

    const order = {
      _id: orderId,
      ...normalizedOrder,
      orderNumber,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(ordersCollection).insertOne(order);

    const responseOrder = {
      ...order,
      _id: orderId.toString(),
    };

    return res.status(201).json({
      message: 'Order placed successfully',
      insertedId: orderId.toString(),
      orderNumber,
      order: responseOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
}

async function getPublicOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const db = getDB();
    const order = await db.collection(ordersCollection).findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
}

async function getOrders(req, res) {
  try {
    const db = getDB();
    const orders = await db.collection(ordersCollection).find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const db = getDB();
    const result = await db.collection(ordersCollection).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
}

async function getAdminStats(req, res) {
  try {
    const db = getDB();
    const [totalProducts, totalOrders, pendingOrdersResult, revenueResult] = await Promise.all([
      db.collection('products').countDocuments(),
      db.collection(ordersCollection).countDocuments(),
      db.collection(ordersCollection).countDocuments({ status: 'pending' }),
      db
        .collection(ordersCollection)
        .aggregate([
          { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])
        .toArray(),
    ]);

    const totalRevenue = revenueResult?.[0]?.total || 0;

    return res.status(200).json({
      totalProducts,
      totalOrders,
      pendingOrders: pendingOrdersResult,
      totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch admin stats', error: error.message });
  }
}

module.exports = {
  createOrder,
  getPublicOrderById,
  getOrders,
  updateOrderStatus,
  getAdminStats,
};
