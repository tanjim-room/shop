import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import useBackendData from '../hooks/useBackendData';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId } = useParams();
  const stateOrder = location.state?.order || null;

  const loadOrder = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/orders/public/${orderId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to load order details');
    }

    return data;
  }, [orderId]);

  const {
    data: order,
    loading,
    error,
  } = useBackendData({
    loader: loadOrder,
    initialData: stateOrder,
    enabled: !stateOrder,
  });

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return '-';
    return new Date(order.createdAt).toLocaleString();
  }, [order]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading order details...</div>;
  }

  if (error || !order) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">{error || 'Order not found'}</div>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-brand-gold/40 shadow-sm p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-ink">Order Successful</h1>
          <p className="text-slate-600 mt-1">Thank you for your order. Your order has been placed successfully.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-brand-soft rounded-lg p-4 border border-brand-gold/20">
          <p><span className="font-semibold">Order Number:</span> {order.orderNumber || '-'}</p>
          <p><span className="font-semibold">Order Date:</span> {formattedDate}</p>
          <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
          <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
          <p className="md:col-span-2"><span className="font-semibold">Address:</span> {order.shippingAddress}</p>
        </div>

        <div className="overflow-x-auto border border-brand-gold/20 rounded-lg">
          <table className="table">
            <thead className="bg-brand-soft/80 text-slate-700">
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={`${order._id}-${item.productId}-${item.name}`}>
                  <td className="font-medium">{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Tk {item.price}</td>
                  <td>Tk {item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right space-y-1">
          <p className="text-slate-600">Subtotal: Tk {order.subtotal ?? 0}</p>
          <p className="text-slate-600">Delivery Charge: Tk {order.deliveryCharge ?? 0}</p>
          <p className="text-2xl font-bold text-brand-gold">Total: Tk {order.totalAmount ?? 0}</p>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="btn bg-brand-gold border-brand-gold text-brand-ink hover:bg-brand-ink hover:border-brand-ink hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
