import React, { useState } from 'react';
import { API_BASE_URL } from '../lib/api';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
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

      setMessage('Order placed successfully!');
      clearCart();
      setCustomerInfo({ customerName: '', customerPhone: '', shippingAddress: '', notes: '' });
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Shopping Cart</h2>
        {!cartItems.length ? (
          <p className="text-slate-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article key={item.productId} className="flex gap-4 border border-slate-200 rounded-lg p-3">
                <img src={item.imageUrl} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-500">Tk {item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center">{item.quantity}</span>
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
                <div className="font-semibold">Tk {item.price * item.quantity}</div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Checkout</h3>
        <p className="mb-4 text-slate-700">Total: <span className="font-bold">Tk {totalAmount}</span></p>

        <form onSubmit={handleCheckout} className="space-y-3">
          <input
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Customer name"
            value={customerInfo.customerName}
            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, customerName: e.target.value }))}
          />
          <input
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Phone number"
            value={customerInfo.customerPhone}
            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, customerPhone: e.target.value }))}
          />
          <textarea
            required
            className="textarea textarea-bordered w-full"
            placeholder="Shipping address"
            value={customerInfo.shippingAddress}
            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, shippingAddress: e.target.value }))}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Notes (optional)"
            value={customerInfo.notes}
            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || !cartItems.length}
          >
            {loading ? 'Placing order...' : 'Buy Now'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Cart;
