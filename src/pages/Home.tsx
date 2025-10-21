import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchCategories, setCategory, setSearchQuery, setPage } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    currentCategory, 
    searchQuery, 
    currentPage, 
    totalPages, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Local state for debounced search
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ 
      page: currentPage, 
      category: currentCategory, 
      search: searchQuery 
    }));
  }, [dispatch, currentPage, currentCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category));
  };

  const handleSearchChange = useCallback((query: string) => {
    setLocalSearchQuery(query);
  }, []);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleAddToCart = (product: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    brand: string;
  }) => {
      // check user is logged in
      if (!isAuthenticated) {
          navigate('/login');
          return;
      }
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        brand: product.brand,
      }));
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProducts({}))}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
    

      <ProductFilters
        categories={categories}
        currentCategory={currentCategory}
        searchQuery={localSearchQuery}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
