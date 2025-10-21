import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsState {
  products: Product[];
  categories: string[];
  currentCategory: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  currentCategory: 'all',
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  isLoading: false,
  error: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page?: number; category?: string; search?: string } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, category = 'all', search = '' } = params;
      let url = `https://dummyjson.com/products?limit=12&skip=${(page - 1) * 12}`;
      
      if (category !== 'all') {
        url = `https://dummyjson.com/products/category/${category}?limit=12&skip=${(page - 1) * 12}`;
      }
      
      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}&limit=12&skip=${(page - 1) * 12}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.currentCategory = 'all';
      state.searchQuery = '';
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / 12);
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // Extract category names from the API response
        if (Array.isArray(action.payload)) {
          state.categories = action.payload.map((category: any) => category.slug || category.name || category);
        } else {
          state.categories = [];
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories = [];
        state.error = action.payload as string;
      });
  },
});

export const { setCategory, setSearchQuery, setPage, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
