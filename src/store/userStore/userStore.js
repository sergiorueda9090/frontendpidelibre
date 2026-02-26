import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id        : null,
  photo     : null,
  first_name : "",
  last_name : "",
  username  : "",
  password  : "",
  password_repeat : "",
  email     : "",
  phone     : "",
  role      : "client",
  is_active : true,
  data      : [],
  selected_record: null,

  // filtros
  filter_roles: "all",
  filter_status: "all",
  filter_start_date: "",
  filter_end_date: "",
  filter_search: "",

  // paginado
  total_count:  0,
  current_page: 0,    // 0-indexed (igual que el componente Pagination)
  page_size:    10,

  // estado de carga
  loading: false,
}

export const userStore = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    set_form_store: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    get_record_store: (state, action) => {
      const { record } = action.payload;
      Object.keys(record).forEach(key => {
        if (key in state) {
          state[key] = record[key];
        }
      });
    },
    get_all_records_store: (state, action) => {
      const { records } = action.payload;
      state.data = records;
    },
    clear_form_store: (state) => {
      state.id        = null;
      state.photo     = null;
      state.first_name = "";
      state.last_name = "";
      state.username  = "";
      state.email     = "";
      state.phone     = "";
      state.password  = "";
      state.password_repeat = "";
      state.role      = "client";
      state.is_active = true;
      state.selected_record = null;
    },
    set_selected_record_store: (state, action) => {
      state.id        = action.payload.id || null;
      state.photo     = action.payload.profile_image || action.payload.photo || null;
      state.first_name = action.payload.first_name || "";
      state.last_name = action.payload.last_name || "";
      state.username  = action.payload.username || "";
      state.email     = action.payload.email || "";
      state.phone     = action.payload.phone || "";
      state.password  = "";
      state.password_repeat = "";
      state.role      = action.payload.role || "client";
      state.is_active = action.payload.is_active !== undefined ? action.payload.is_active : true;
      state.selected_record = action.payload;
    },
    set_filter_store: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    clear_filter_store: (state) => {
      state.filter_roles      = "all";
      state.filter_status     = "all";
      state.filter_start_date = "";
      state.filter_end_date   = "";
      state.filter_search     = "";
      state.current_page      = 0;
    },
    set_pagination_store: (state, action) => {
      const { total_count, current_page, page_size } = action.payload;
      if (total_count  !== undefined) state.total_count  = total_count;
      if (current_page !== undefined) state.current_page = current_page;
      if (page_size    !== undefined) state.page_size    = page_size;
    },
    set_loading_store: (state, action) => {
      state.loading = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set_form_store, get_record_store, get_all_records_store,
                clear_form_store, set_selected_record_store,
                set_filter_store, clear_filter_store,
                set_pagination_store, set_loading_store } = userStore.actions

export default userStore.reducer