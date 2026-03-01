import React, { useState } from 'react';
import { Package, List, ImagePlus, Loader2, Banknote, PlusCircle, Trash2 } from 'lucide-react';
import { adminApiFetch, uploadMultipleImagesToImgbb } from '../../lib/api';
import Swal from 'sweetalert2';

const AddProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrls: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError('');
    setImageUploading(true);

    try {
      const uploadedUrls = await uploadMultipleImagesToImgbb(files);
      setProduct((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (uploadError) {
      setError(uploadError.message);
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: uploadError.message,
        confirmButtonColor: '#C7A64A',
      });
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (targetUrl) => {
    setProduct((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== targetUrl),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await adminApiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to add product');
      }

      setSuccess('Product added successfully!');
      Swal.fire({
        icon: 'success',
        title: 'Product added',
        text: 'The product was added successfully.',
        confirmButtonColor: '#C7A64A',
      });
      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrls: [],
      });
    } catch (submitError) {
      setError(submitError.message);
      Swal.fire({
        icon: 'error',
        title: 'Add failed',
        text: submitError.message,
        confirmButtonColor: '#C7A64A',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className='flex items-center justify-center p-6'>
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-gold/30 p-8 text-slate-900">
     <h2 className="text-2xl font-bold text-brand-ink mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-sm text-left font-medium text-slate-700 mb-2">Product Name</label>
          <div className="relative">
            <Package className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              name="name"
              type="text"
              required
              value={product.name}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none text-black"
              placeholder="e.g. Royal Oud Intense"
              onChange={handleChange}
            /> 
          </div>
        </div>

        {/* Category */}
       <div>
  <label className="block text-sm text-left font-medium text-slate-700 mb-2">
    Category
  </label>
  <div className="relative">
    <List className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
    
    <input
      list="category-options"
      name="category"
      value={product.category}
      placeholder="Select or type a category"
      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none text-black"
      onChange={handleChange}
    />

    <datalist id="category-options">
      <option value="Woody" />
      <option value="Floral" />
      <option value="Musk" />
      <option value="Oriental" />
    </datalist>
  </div>
</div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-left text-slate-700 mb-2">Price (Tk)</label>
          <div className="relative">
            <Banknote className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              name="price"
              type="number"
              min="1"
              required
              value={product.price}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none text-black"
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-left text-slate-700 mb-2">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={product.stock}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none text-black"
            placeholder="0"
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-left text-slate-700 mb-2">Description</label>
          <textarea
            name="description"
            rows="4"
            value={product.description}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none text-black"
            placeholder="Describe the products..."
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-left text-slate-700 mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-3 file-input file-input-bordered w-full text-slate-700"
            onChange={handleImageUpload}
          />
          {imageUploading && <p className="text-sm text-brand-gold mt-2">Uploading images...</p>}
          {product.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {product.imageUrls.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt="Preview"
                    className="h-28 w-full object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 text-xs px-2 py-1 rounded bg-red-600/90 text-white inline-flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {(error || success) && (
          <div className="md:col-span-2">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-ink text-brand-ink hover:text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98] disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={18} />}
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
   </div>
  );
};

export default AddProductForm;