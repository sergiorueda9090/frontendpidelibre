import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockUsers } from '../../utils/mockData';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  await delay(700);
  return mockUsers;
});

export const createUser = createAsyncThunk('users/create', async (user) => {
  await delay(600);
  return { ...user, id: Date.now(), orders: 0, joined: new Date().toISOString().split('T')[0] };
});

export const updateUser = createAsyncThunk('users/update', async (user) => {
  await delay(600);
  return user;
});

export const deleteUser = createAsyncThunk('users/delete', async (id) => {
  await delay(400);
  return id;
});

export const toggleUser = createAsyncThunk('users/toggle', async (user) => {
  await delay(350);
  return { ...user, status: user.status === 'active' ? 'blocked' : 'active' };
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, saving: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createUser.pending, (s) => { s.saving = true; })
      .addCase(createUser.fulfilled, (s, a) => { s.saving = false; s.items.push(a.payload); })
      .addCase(createUser.rejected, (s) => { s.saving = false; })
      .addCase(updateUser.pending, (s) => { s.saving = true; })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.saving = false;
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(updateUser.rejected, (s) => { s.saving = false; })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      })
      .addCase(toggleUser.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      });
  },
});

export default usersSlice.reducer;
