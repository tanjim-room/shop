import React, { useCallback, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApiFetch, uploadMultipleImagesToImgbb } from '../lib/api';
import Swal from 'sweetalert2';
import ProductEditForm from '../components/admin/ProductEditForm';
import useBackendData from '../hooks/useBackendData';

const AdminProducts = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const loadProducts = useCallback(async () => {
    const response = await adminApiFetch('/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    return response.json();
  }, []);

  const {
    data: products = [],
    setData: setProducts,
    loading,
    error,
  } = useBackendData({
    loader: loadProducts,
    initialData: [],
  });

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Delete product?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#64748B',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setActionError('');
      const response = await adminApiFetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Product deleted successfully.',
        confirmButtonColor: '#C7A64A',
      });
    } catch (deleteError) {
      setActionError(deleteError.message);
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: deleteError.message,
        confirmButtonColor: '#C7A64A',
      });
    }
  };

  const openEditPanel = (product) => {
    setSuccess('');
    setActionError('');
    setEditingProduct({
      ...product,
      imageUrls:
        Array.isArray(product.imageUrls) && product.imageUrls.length
          ? product.imageUrls
          : product.imageUrl
            ? [product.imageUrl]
            : [],
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setActionError('');

    try {
      const urls = await uploadMultipleImagesToImgbb(files);
      setEditingProduct((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...urls],
      }));
    } catch (uploadError) {
      setActionError(uploadError.message);
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: uploadError.message,
        confirmButtonColor: '#C7A64A',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (targetUrl) => {
    setEditingProduct((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter((url) => url !== targetUrl),
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingProduct?._id) return;

    setSaving(true);
    setActionError('');
    setSuccess('');

    try {
      const response = await adminApiFetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description || '',
          category: editingProduct.category,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock || 0),
          imageUrls: editingProduct.imageUrls || [],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update product');
      }

      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingProduct._id
            ? {
                ...product,
                ...editingProduct,
                price: Number(editingProduct.price),
                stock: Number(editingProduct.stock),
                imageUrl: editingProduct.imageUrls?.[0] || '',
              }
            : product
        )
      );

      setSuccess('Product updated successfully');
      setEditingProduct(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Product updated successfully.',
        confirmButtonColor: '#C7A64A',
      });
    } catch (updateError) {
      setActionError(updateError.message);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: updateError.message,
        confirmButtonColor: '#C7A64A',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading products...</div>;
  }

  return (
    <section className="space-y-4 text-slate-800">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Manage Products</h2>
      {(error || actionError) && <p className="text-red-600 text-sm mb-3">{actionError || error}</p>}
      {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

      <ProductEditForm
        editingProduct={editingProduct}
        uploading={uploading}
        saving={saving}
        onChange={handleEditChange}
        onImageUpload={handleEditImageUpload}
        onRemoveImage={removeImage}
        onSubmit={handleUpdate}
        onCancel={() => setEditingProduct(null)}
      />

      <div className="overflow-x-auto bg-white rounded-xl border border-brand-gold/40 shadow-sm">
        <table className="table">
          <thead className="text-slate-700 bg-brand-soft/70">
            <tr>
              <th>Image</th>
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
                <td>
                  <img
                    src={product.imageUrls?.[0] || product.imageUrl || 'https://placehold.co/100x100?text=No+Image'}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="font-medium">{product.name}</td>
                <td>{product.category}</td>
                <td>Tk {product.price}</td>
                <td>{product.stock}</td>
                <td className="space-x-2">
                  <button
                    type="button"
                    className="btn btn-sm px-4 py-2  text-brand-ink hover:bg-brand-soft inline-flex items-center gap-2 border-brand-gold border-2"
                    onClick={() => openEditPanel(product)}
                  >
                    <Pencil size={14} className="text-blue-600" />
                    View / Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-outline btn-sm px-4 py-2 inline-flex items-center gap-2 border-brand-gold border-2"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={14} className="text-red-600" />
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
