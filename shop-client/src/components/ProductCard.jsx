import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const imageUrl = product.imageUrls?.[0] || product.imageUrl || 'https://placehold.co/600x400?text=No+Image';

  return (
    <article className="group h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 space-y-3 text-slate-800 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 leading-tight">{product.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
            {product.category || 'Uncategorized'}
          </span>
        </div>

        <p className="text-sm text-slate-600 min-h-10 line-clamp-2">{product.description || 'No description available.'}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-blue-700">Tk {product.price}</span>
          <span className="text-sm text-slate-500">Stock: {product.stock}</span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm w-full mt-auto"
          onClick={() =>
            onAddToCart({
              productId: product._id,
              name: product.name,
              price: Number(product.price),
              imageUrl,
            })
          }
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
