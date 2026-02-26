import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockOrders } from '../../utils/mockData';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  await delay(800);
  return mockOrders;
});

export const updateOrder = createAsyncThunk('orders/update', async (order) => {
  await delay(600);
  return order;
});

export const deleteOrder = createAsyncThunk('orders/delete', async (id) => {
  await delay(400);
  return id;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(updateOrder.pending, (s) => { s.saving = true; })
      .addCase(updateOrder.fulfilled, (s, a) => {
        s.saving = false;
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(updateOrder.rejected, (s) => { s.saving = false; })
      .addCase(deleteOrder.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      });
  },
});

export default ordersSlice.reducer;
