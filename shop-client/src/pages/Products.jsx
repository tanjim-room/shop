import React, { useCallback } from 'react';
import { API_BASE_URL } from '../lib/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import useBackendData from '../hooks/useBackendData';

const Products = () => {
  const { addToCart } = useCart();

  const loadProducts = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    return response.json();
  }, []);

  const {
    data: products = [],
    loading,
    error,
  } = useBackendData({
    loader: loadProducts,
    initialData: [],
  });

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto p-6 text-red-600">{error}</div>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Our Products</h2>

      {products.length === 0 ? (
        <p className="text-slate-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;
