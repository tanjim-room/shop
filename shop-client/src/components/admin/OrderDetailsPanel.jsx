import React from 'react';

const OrderDetailsPanel = ({ order }) => {
  return (
    <div className="bg-brand-soft rounded-lg border border-brand-gold/30 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p><span className="font-semibold">Order No:</span> {order.orderNumber || '-'}</p>
        <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
        <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
        <p className="md:col-span-2"><span className="font-semibold">Address:</span> {order.shippingAddress || '-'}</p>
        <p className="md:col-span-2"><span className="font-semibold">Notes:</span> {order.notes || '-'}</p>
      </div>

      <div className="overflow-x-auto bg-white rounded border border-brand-gold/20">
        <table className="table table-sm">
          <thead>
            <tr className='text-black'>
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
    </div>
  );
};

export default OrderDetailsPanel;
