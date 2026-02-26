import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open_modal: false,
    close_modal: false,
    open_delete_modal: false,
    close_delete_modal: false,
    open_modal_read_only: false,
}

export const globalStore = createSlice({
  name: 'globalStore',
  initialState,
  reducers: {
    open_modal_store: (state) => {
      state.open_modal = true;
    },
    close_modal_store: (state) => {
      state.open_modal = false;
    },
    open_delete_modal_store: (state) => {
      state.open_delete_modal = true;
    },
    close_delete_modal_store: (state) => {
      state.open_delete_modal = false;
    },
    read_only_store: (state) => {
      state.open_modal_read_only = true;
    },
    read_view_store: (state) => {
      state.open_modal_read_only = false;
    },
  },
})  
// Action creators are generated for each case reducer function
export const { open_modal_store, close_modal_store, open_delete_modal_store, close_delete_modal_store, read_only_store, read_view_store } = globalStore.actions

export default globalStore.reducer