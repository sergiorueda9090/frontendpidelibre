import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axiosInstance';

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('api/order/all/', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error cargando órdenes');
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchDetail',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`api/order/detail/${orderNumber}/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Orden no encontrada');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`api/order/${id}/delete/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error eliminando orden');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: (state) => { state.selectedOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchOrderDetail.pending, (s) => { s.saving = true; })
      .addCase(fetchOrderDetail.fulfilled, (s, a) => { s.saving = false; s.selectedOrder = a.payload; })
      .addCase(fetchOrderDetail.rejected, (s) => { s.saving = false; })
      .addCase(deleteOrder.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      });
  },
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
