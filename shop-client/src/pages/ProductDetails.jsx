import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { useCart } from '../context/CartContext';
import useBackendData from '../hooks/useBackendData';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to load product');
    }

    return data;
  }, [id]);

  const {
    data: product,
    loading,
    error,
  } = useBackendData({
    loader: loadProduct,
    initialData: null,
  });

  useEffect(() => {
    if (!product) return;
    const firstImage = product?.imageUrls?.[0] || product?.imageUrl || 'https://placehold.co/800x600?text=No+Image';
    setActiveImage(firstImage);
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.imageUrls) && product.imageUrls.length) return product.imageUrls;
    if (product.imageUrl) return [product.imageUrl];
    return ['https://placehold.co/800x600?text=No+Image'];
  }, [product]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="max-w-7xl mx-auto p-6 text-red-600">{error || 'Product not found'}</div>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="mb-5">
        <Link to="/products" className="text-sm text-brand-ink hover:text-brand-gold">← Back to products</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-brand-gold/30 shadow-sm p-6">
        <div>
          <img src={activeImage} alt={product.name} className="w-full h-[440px] object-cover rounded-xl border border-slate-200" />

          <div className="grid grid-cols-4 gap-3 mt-4">
            {galleryImages.map((image) => (
              <button
                key={image}
                type="button"
                className={`rounded-lg border overflow-hidden ${activeImage === image ? 'border-brand-gold' : 'border-slate-200'}`}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt="Product thumbnail" className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-brand-ink">{product.name}</h1>
            <span className="text-xs px-3 py-1 rounded-full bg-brand-soft text-brand-ink border border-brand-gold/40">
              {product.category || 'Uncategorized'}
            </span>
          </div>

          <p className="text-brand-gold text-3xl font-bold mt-4">Tk {product.price}</p>
          <p className="text-slate-500 mt-1">Stock: {product.stock}</p>

          <p className="text-slate-700 leading-7 mt-6">{product.description || 'No description available for this product.'}</p>

          <div className="mt-8 space-y-4">
            <label className="font-medium text-slate-700">Quantity</label>
            <div className="flex items-center gap-3 mb-16">
              <button
                type="button"
                className="btn btn-sm bg-brand-gold rounded-full px-2 text-lg font-bold"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="min-w-10 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                className="btn btn-sm bg-brand-gold rounded-full px-2 text-lg font-bold"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn w-full md:w-auto bg-brand-gold border-brand-gold text-brand-ink hover:bg-brand-ink hover:border-brand-ink hover:text-brand-gold px-4"
              onClick={() =>
                addToCart({
                  productId: product._id,
                  name: product.name,
                  price: Number(product.price),
                  imageUrl: activeImage,
                  quantity,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
