import React from 'react';

const ProductFilters: React.FC<any> = ({
  categories,
  currentCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="sm:w-64">
        
          <select
            id="category-select"
            value={currentCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {categories && categories.length > 0 ? categories.map((category: any) => {
              // Handle both string and object categories
              const categoryStr = typeof category === 'string' ? category : 
                                 typeof category === 'object' && category !== null ? 
                                 (category.slug || category.name || String(category)) : 
                                 String(category);
              return (
                <option key={categoryStr} value={categoryStr}>
                  {categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1)}
                </option>
              );
            }) : null}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
