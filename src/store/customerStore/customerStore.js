import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // campos del formulario
  id              : null,
  first_name      : "",
  last_name       : "",
  email           : "",
  phone           : "",
  document_number : "",
  date_of_birth   : "",
  gender          : null,
  is_active       : true,

  // lista y registro seleccionado
  data            : [],
  selected_record : null,

  // filtros
  filter_search  : "",
  filter_status  : "all",   // "all" | "active" | "inactive"
  filter_deleted : false,   // false = activos | true = eliminados (soft delete)

  // paginado
  total_count  : 0,
  current_page : 0,   // 0-indexed
  page_size    : 10,

  // estado de carga
  loading: false,
}

export const customerStore = createSlice({
  name: 'customerStore',
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
      state.data = action.payload.records;
    },
    clear_form_store: (state) => {
      state.id              = null;
      state.first_name      = "";
      state.last_name       = "";
      state.email           = "";
      state.phone           = "";
      state.document_number = "";
      state.date_of_birth   = "";
      state.gender          = null;
      state.is_active       = true;
      state.selected_record = null;
    },
    set_selected_record_store: (state, action) => {
      const r = action.payload;
      state.id              = r.id              || null;
      state.first_name      = r.first_name      || "";
      state.last_name       = r.last_name       || "";
      state.email           = r.email           || "";
      state.phone           = r.phone           || "";
      state.document_number = r.document_number || "";
      state.date_of_birth   = r.date_of_birth   || "";
      state.gender          = r.gender?.id       ?? null;
      state.is_active       = r.is_active       !== undefined ? r.is_active : true;
      state.selected_record = r;
    },
    set_filter_store: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    clear_filter_store: (state) => {
      state.filter_search  = "";
      state.filter_status  = "all";
      state.filter_deleted = false;
      state.current_page   = 0;
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

export const {
  set_form_store, get_record_store, get_all_records_store,
  clear_form_store, set_selected_record_store,
  set_filter_store, clear_filter_store,
  set_pagination_store, set_loading_store,
} = customerStore.actions

export default customerStore.reducer
