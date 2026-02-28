import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <section className="p-6 max-w-7xl text-slate-800">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Manage Products</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="table">
          <thead className="text-slate-500">
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="font-medium">{product.name}</td>
                <td>{product.category}</td>
                <td>Tk {product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-error btn-outline btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProducts;
