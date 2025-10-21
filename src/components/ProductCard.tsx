import React from 'react';




const ProductCard: React.FC<any> = ({ product, onAddToCart }) => {
  const discountedPrice = product.price - (product.price * product.discountPercentage / 100);

  return (
    <div className="card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-xl font-bold text-green-600">${discountedPrice.toFixed(2)}</span>
          {product.discountPercentage > 0 && (
            <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">In Stock ({product.stock})</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
        
        <button
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 active:bg-primary-800"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
