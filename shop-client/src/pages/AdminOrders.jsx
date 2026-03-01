import React, { useEffect, useState } from 'react';
import { adminApiFetch } from '../lib/api';
import OrderEditActions from '../components/admin/OrderEditActions';
import OrderDetailsPanel from '../components/admin/OrderDetailsPanel';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState('');

  const loadOrders = async () => {
    try {
      setError('');
      const response = await adminApiFetch('/api/orders');
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      setOrders(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await adminApiFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Failed to update status');
      }

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
      return true;
    } catch (statusError) {
      setError(statusError.message);
      return false;
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading orders...</div>;
  }

  return (
    <section className="space-y-4 text-slate-800">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Manage Orders</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-xl border border-brand-gold/40 shadow-sm">
        <table className="table">
          <thead className="text-slate-700 bg-brand-soft/70">
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td className="font-semibold text-brand-ink">{order.orderNumber || '-'}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>Tk {order.totalAmount}</td>
                  <td>
                    <span className="badge badge-outline capitalize">{order.status}</span>
                  </td>
                  <td className="whitespace-nowrap align-middle py-2">
                    <OrderEditActions
                      order={order}
                      statuses={statuses}
                      isExpanded={expandedOrderId === order._id}
                      onToggleDetails={() => setExpandedOrderId((prev) => (prev === order._id ? '' : order._id))}
                      onUpdateStatus={updateStatus}
                    />
                  </td>
                </tr>

                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan={7}>
                      <OrderDetailsPanel order={order} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminOrders;
