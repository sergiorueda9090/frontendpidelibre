import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockClients } from '../../utils/mockData';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchClients = createAsyncThunk('clients/fetchAll', async () => {
  await delay(800);
  return mockClients;
});

export const createClient = createAsyncThunk('clients/create', async (client) => {
  await delay(600);
  return {
    ...client,
    id: Date.now(),
    totalSpent: 0,
    orders: 0,
    lastOrder: null,
    joined: new Date().toISOString().split('T')[0],
  };
});

export const updateClient = createAsyncThunk('clients/update', async (client) => {
  await delay(600);
  return client;
});

export const deleteClient = createAsyncThunk('clients/delete', async (id) => {
  await delay(400);
  return id;
});

export const toggleClient = createAsyncThunk('clients/toggle', async (client) => {
  await delay(350);
  return { ...client, status: client.status === 'active' ? 'blocked' : 'active' };
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (s) => { s.loading = true; })
      .addCase(fetchClients.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchClients.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createClient.pending, (s) => { s.saving = true; })
      .addCase(createClient.fulfilled, (s, a) => { s.saving = false; s.items.push(a.payload); })
      .addCase(createClient.rejected, (s) => { s.saving = false; })
      .addCase(updateClient.pending, (s) => { s.saving = true; })
      .addCase(updateClient.fulfilled, (s, a) => {
        s.saving = false;
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(updateClient.rejected, (s) => { s.saving = false; })
      .addCase(deleteClient.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      })
      .addCase(toggleClient.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      });
  },
});

export default clientsSlice.reducer;
