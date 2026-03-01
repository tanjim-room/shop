import React from 'react';
import Swal from 'sweetalert2';

const OrderEditActions = ({
  order,
  statuses,
  isExpanded,
  onToggleDetails,
  onUpdateStatus,
}) => {
  const handleStatusChange = async (nextStatus) => {
    if (order.status === nextStatus) {
      return;
    }

    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Change order status?',
      text: `${order.customerName}: ${order.status} → ${nextStatus}`,
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#C7A64A',
      cancelButtonColor: '#64748B',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const isUpdated = await onUpdateStatus(order._id, nextStatus);

    if (isUpdated) {
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: `Order status changed to ${nextStatus}.`,
        confirmButtonColor: '#C7A64A',
      });
    }
  };

  return (
    <div className="inline-flex items-center gap-3 flex-nowrap">
      <select
        className="select select-bordered select-sm h-10 min-h-10 min-w-[130px] bg-brand-gold px-3 py-2 leading-none"
        value={order.status}
        onChange={(event) => handleStatusChange(event.target.value)}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-sm h-10 min-h-10 px-4 border-brand-gold text-brand-ink hover:bg-brand-soft bg-gray-200"
        onClick={onToggleDetails}
      >
        {isExpanded ? 'Hide' : 'Details'}
      </button>
    </div>
  );
};

export default OrderEditActions;
