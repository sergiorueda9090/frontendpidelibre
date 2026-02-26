import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockProducts } from '../../utils/mockData';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  await delay(800);
  return mockProducts;
});

export const createProduct = createAsyncThunk('products/create', async (product) => {
  await delay(600);
  return { ...product, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
});

export const updateProduct = createAsyncThunk('products/update', async (product) => {
  await delay(600);
  return product;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await delay(400);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createProduct.pending, (s) => { s.saving = true; })
      .addCase(createProduct.fulfilled, (s, a) => { s.saving = false; s.items.push(a.payload); })
      .addCase(createProduct.rejected, (s) => { s.saving = false; })
      .addCase(updateProduct.pending, (s) => { s.saving = true; })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.saving = false;
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(updateProduct.rejected, (s) => { s.saving = false; })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      });
  },
});

export default productsSlice.reducer;
