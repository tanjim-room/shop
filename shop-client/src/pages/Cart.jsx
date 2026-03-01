import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../lib/api';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const deliveryCharge = cartItems.length ? 80 : 0;
  const payableTotal = totalAmount + deliveryCharge;
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!cartItems.length) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerInfo,
          items: cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to place order');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Order placed successfully',
        text: `Order Number: ${data?.orderNumber || '-'}`,
        confirmButtonColor: '#C7A64A',
      });

      clearCart();
      setCustomerInfo({ customerName: '', customerPhone: '', shippingAddress: '', notes: '' });
      setMessage('Order placed successfully!');

      if (data?.insertedId) {
        navigate(`/order-success/${data.insertedId}`, {
          replace: true,
          state: { order: data?.order },
        });
      }
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-ink">Checkout</h1>
        <p className="text-slate-600 mt-1">Review your products and complete shipping information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-800">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-brand-gold/30 p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-brand-ink">Order Items</h2>
          {!cartItems.length ? (
            <p className="text-slate-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article key={item.productId} className="flex gap-4 border border-slate-200 rounded-xl p-3 items-center">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-ink">{item.name}</h3>
                    <p className="text-sm text-slate-500">Tk {item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-xs"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-xs"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-error btn-outline ml-2"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold text-brand-gold">Tk {item.price * item.quantity}</div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-brand-gold/40 p-6 h-fit shadow-md space-y-6">
          <div className="pb-4 border-b border-brand-gold/20">
            <h3 className="text-2xl font-bold text-brand-ink">Order Summary</h3>
            <div className="mt-4 flex justify-between text-slate-600 text-base">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-600 text-base">
              <span>Subtotal</span>
              <span>Tk {totalAmount}</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-600 text-base">
              <span>Delivery Charge</span>
              <span>Tk {deliveryCharge}</span>
            </div>
            <div className="mt-3 flex justify-between text-2xl font-bold text-brand-gold">
              <span>Total</span>
              <span>Tk {payableTotal}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <h3 className="text-xl font-semibold text-brand-ink">Shipping Details</h3>

            <label className="block text-sm font-medium text-slate-700">Customer name</label>
            <input
              type="text"
              required
              className="input w-full bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold px-2"
              placeholder="Enter your full name"
              value={customerInfo.customerName}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, customerName: e.target.value }))}
            />

            <label className="block text-sm font-medium text-slate-700">Phone number</label>
            <input
              type="text"
              required
              className="input w-full bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold px-2"
              placeholder="e.g. 01XXXXXXXXX"
              value={customerInfo.customerPhone}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, customerPhone: e.target.value }))}
            />

            <label className="block text-sm font-medium text-slate-700">Shipping address</label>
            <textarea
              required
              rows={3}
              className="textarea w-full bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold px-2"
              placeholder="House, road, area, city"
              value={customerInfo.shippingAddress}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, shippingAddress: e.target.value }))}
            />

            <label className="block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              rows={3}
              className="textarea w-full bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold px-2"
              placeholder="Special delivery instructions"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <button
              type="submit"
              className="btn w-full h-12 text-base font-semibold bg-brand-gold border-brand-gold text-brand-ink hover:bg-brand-ink hover:border-brand-ink hover:text-white"
              disabled={loading || !cartItems.length}
            >
              {loading ? 'Placing order...' : 'Place Order'}
            </button>

            <p className="text-xs text-slate-500 text-center">Safe checkout • Premium Fragrance</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Cart;
