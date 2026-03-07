import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // campos del formulario
  id              : null,
  logo            : null,
  description     : "",
  facebook_url    : "",
  twitter_url     : "",
  linkedin_url    : "",
  instagram_url   : "",
  phone           : "",
  phone_label     : "",
  email           : "",
  copyright_text  : "",
  payment_image   : null,
  is_active       : true,

  // lista y registro seleccionado
  data             : [],
  selected_record  : null,

  // filtros
  filter_search  : "",
  filter_status  : "all",
  filter_deleted : false,

  // paginado
  total_count  : 0,
  current_page : 0,
  page_size    : 10,

  // estado de carga
  loading: false,
}

export const footerStore = createSlice({
  name: 'footerStore',
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
      state.logo            = null;
      state.description     = "";
      state.facebook_url    = "";
      state.twitter_url     = "";
      state.linkedin_url    = "";
      state.instagram_url   = "";
      state.phone           = "";
      state.phone_label     = "";
      state.email           = "";
      state.copyright_text  = "";
      state.payment_image   = null;
      state.is_active       = true;
      state.selected_record = null;
    },
    set_selected_record_store: (state, action) => {
      const r = action.payload;
      state.id              = r.id              || null;
      state.logo            = r.logo            || null;
      state.description     = r.description     || "";
      state.facebook_url    = r.facebook_url    || "";
      state.twitter_url     = r.twitter_url     || "";
      state.linkedin_url    = r.linkedin_url    || "";
      state.instagram_url   = r.instagram_url   || "";
      state.phone           = r.phone           || "";
      state.phone_label     = r.phone_label     || "";
      state.email           = r.email           || "";
      state.copyright_text  = r.copyright_text  || "";
      state.payment_image   = r.payment_image   || null;
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
} = footerStore.actions

export default footerStore.reducer
