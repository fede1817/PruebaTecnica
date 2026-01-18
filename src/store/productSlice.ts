import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {ProductState, Product, ProductsResponse} from '../types';
import {productService} from '../services/api';

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
  page: 0,
  limit: 10,
  hasMore: true,
  searchQuery: '',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number, {getState}) => {
    const state = getState() as {products: ProductState};
    const {limit, searchQuery} = state.products;
    const skip = page * limit;

    console.log(`Fetching: page=${page}, skip=${skip}, query="${searchQuery}"`);

    try {
      let response;
      if (searchQuery && searchQuery.trim().length > 0) {
        console.log(`Searching for: "${searchQuery}"`);
        response = await productService.searchProducts(
          searchQuery,
          limit,
          skip,
        );
      } else {
        response = await productService.getProducts(limit, skip);
      }

      console.log(`Received ${response.products.length} products`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 0;
      state.items = [];
      state.hasMore = true;
    },
    clearSearch: state => {
      state.searchQuery = '';
      state.page = 0;
      state.items = [];
      state.hasMore = true;
    },
    resetPage: state => {
      state.page = 0;
    },
    incrementPage: state => {
      state.page += 1;
    },
    clearProducts: state => {
      state.items = [];
      state.page = 0;
      state.hasMore = true;
    },
    resetState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.status = 'succeeded';

          const newProducts = action.payload.products;
          const total = action.payload.total;
          const skip = action.payload.skip;

          console.log(
            `[Redux] Received ${newProducts.length} products, skip: ${skip}, total: ${total}`,
          );

          // Si es la primera página (skip === 0), reemplazamos todo
          if (skip === 0) {
            console.log('[Redux] First page, replacing all products');
            state.items = newProducts;
          } else {
            // Para páginas siguientes, evitamos duplicados
            console.log(
              '[Redux] Subsequent page, merging and avoiding duplicates',
            );
            const existingIds = new Set(state.items.map(item => item.id));
            const uniqueNewProducts = newProducts.filter(
              product => !existingIds.has(product.id),
            );

            if (uniqueNewProducts.length < newProducts.length) {
              console.warn(
                `[Redux] Filtered out ${
                  newProducts.length - uniqueNewProducts.length
                } duplicate products`,
              );
            }

            state.items = [...state.items, ...uniqueNewProducts];
          }

          // Actualizar hasMore basado en el total de productos disponibles
          state.hasMore = state.items.length < total;

          // Actualizar la página basada en cuántos items tenemos
          state.page = Math.floor(state.items.length / state.limit);

          console.log(
            `[Redux] State updated: ${state.items.length} items, page: ${state.page}, hasMore: ${state.hasMore}`,
          );
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
        console.error('[Redux] Fetch products failed:', state.error);
      });
  },
});

export const {
  setSearchQuery,
  clearSearch,
  resetPage,
  incrementPage,
  clearProducts,
  resetState,
} = productSlice.actions;

export default productSlice.reducer;
