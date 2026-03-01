import React from 'react';
import { Save, XCircle } from 'lucide-react';

const ProductEditForm = ({
  editingProduct,
  uploading,
  saving,
  onChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
  onCancel,
}) => {
  if (!editingProduct) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="mb-5 bg-white rounded-xl border border-brand-gold/40 shadow-sm p-5 space-y-3"
    >
      <h3 className="text-lg font-semibold text-brand-ink">Edit Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Product Name</label>
          <br />
          <input
            name="name"
            value={editingProduct.name || ''}
            onChange={onChange}
            className="input input-bordered bg-white border-brand-gold border-2 px-2"
            placeholder="Product name"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Category</label>
          <br />
          <input
            name="category"
            value={editingProduct.category || ''}
            onChange={onChange}
            className="input input-bordered bg-white border-brand-gold border-2 px-2"
            placeholder="Category"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Price</label>
          <br />
          <input
            name="price"
            type="number"
            min="1"
            value={editingProduct.price || ''}
            onChange={onChange}
            className="input input-bordered bg-white border-brand-gold border-2 px-2"
            placeholder="Price"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Stock</label>
          <br />
          <input
            name="stock"
            type="number"
            min="0"
            value={editingProduct.stock || ''}
            onChange={onChange}
            className="input input-bordered bg-white border-brand-gold border-2 px-2"
            placeholder="Stock"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <br />
        <textarea
          name="description"
          value={editingProduct.description || ''}
          onChange={onChange}
          className="textarea textarea-bordered w-full bg-white border-brand-gold border-2 px-2"
          placeholder="Description"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input file-input-bordered w-full bg-white border-brand-gold"
          onChange={onImageUpload}
        />
      </div>
      {uploading && <p className="text-sm text-brand-gold">Uploading images...</p>}

      {(editingProduct.imageUrls || []).length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {editingProduct.imageUrls.map((url) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt="Product"
                className="h-16 w-full object-cover rounded border border-slate-200"
              />
              <button
                type="button"
                className="absolute top-1 right-1 text-[10px] px-1 rounded bg-black/70 text-white"
                onClick={() => onRemoveImage(url)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn px-4 py-2 bg-brand-gold border-brand-gold text-brand-ink hover:bg-brand-ink hover:text-white inline-flex items-center gap-2"
          disabled={saving || uploading}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          className="btn btn-outline px-4 py-2 inline-flex items-center gap-2"
          onClick={onCancel}
        >
          <XCircle size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;
