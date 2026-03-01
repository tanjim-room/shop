const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const collectionName = 'products';

function normalizeProduct(body = {}) {
  const incomingImageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls
    : body.imageUrl
      ? [body.imageUrl]
      : [];

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    category: String(body.category || '').trim(),
    imageUrls: incomingImageUrls
      .map((url) => String(url || '').trim())
      .filter(Boolean),
    price: Number(body.price),
    stock: Number(body.stock ?? 0),
  };
}

function validateProduct(product) {
  if (!product.name) return 'Product name is required';
  if (!product.category) return 'Category is required';
  if (Number.isNaN(product.price) || product.price <= 0) return 'Price must be greater than 0';
  if (Number.isNaN(product.stock) || product.stock < 0) return 'Stock cannot be negative';
  return null;
}

async function createProduct(req, res) {
  try {
    const product = normalizeProduct(req.body);
    const validationError = validateProduct(product);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const db = getDB();
    const now = new Date();

    const result = await db.collection(collectionName).insertOne({
      ...product,
      imageUrl: product.imageUrls[0] || '',
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({
      message: 'Product created successfully',
      insertedId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const db = getDB();
    const products = await db
      .collection(collectionName)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const db = getDB();
    const product = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const db = getDB();
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = normalizeProduct(req.body);
    const validationError = validateProduct(product);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const db = getDB();
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...product,
          imageUrl: product.imageUrls[0] || '',
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
