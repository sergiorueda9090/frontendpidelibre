import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // campos del formulario
  id                : null,
  image             : null,
  name              : "",
  slug              : "",
  category          : null,   // id de la Category o null
  brand             : null,   // id de la Brand o null
  gender            : null,   // id del Gender o null
  description       : "",
  short_description : "",
  price             : "",
  compare_price     : "",
  cost_price        : "",
  sku               : "",
  stock             : "",
  is_active         : true,
  is_featured       : false,
  is_new            : false,
  meta_title        : "",
  meta_description  : "",

  // lista y registro seleccionado
  data            : [],
  selected_record : null,

  // filtros
  filter_search   : "",
  filter_status   : "all",   // "all" | "active" | "inactive"
  filter_category : null,    // category_id para filtrar por categoría
  filter_deleted  : false,   // false = activos | true = eliminados (soft delete)

  // paginado
  total_count  : 0,
  current_page : 0,   // 0-indexed
  page_size    : 10,

  // estado de carga
  loading: false,
}

export const productsStore = createSlice({
  name: 'productsStore',
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
      state.id                = null;
      state.image             = null;
      state.name              = "";
      state.slug              = "";
      state.category          = null;
      state.brand             = null;
      state.gender            = null;
      state.description       = "";
      state.short_description = "";
      state.price             = "";
      state.compare_price     = "";
      state.cost_price        = "";
      state.sku               = "";
      state.stock             = "";
      state.is_active         = true;
      state.is_featured       = false;
      state.is_new            = false;
      state.meta_title        = "";
      state.meta_description  = "";
      state.selected_record   = null;
    },
    set_selected_record_store: (state, action) => {
      const r = action.payload;
      state.id                = r.id                || null;
      state.image             = r.image             || null;
      state.name              = r.name              || "";
      state.slug              = r.slug              || "";
      state.category          = r.category?.id      ?? null;
      state.brand             = r.brand?.id          ?? null;
      state.gender            = r.gender?.id         ?? null;
      state.description       = r.description       || "";
      state.short_description = r.short_description || "";
      state.price             = r.price             ?? "";
      state.compare_price     = r.compare_price     ?? "";
      state.cost_price        = r.cost_price        ?? "";
      state.sku               = r.sku               || "";
      state.stock             = r.stock             ?? "";
      state.is_active         = r.is_active         !== undefined ? r.is_active : true;
      state.is_featured       = r.is_featured       !== undefined ? r.is_featured : false;
      state.is_new            = r.is_new            !== undefined ? r.is_new : false;
      state.meta_title        = r.meta_title        || "";
      state.meta_description  = r.meta_description  || "";
      state.selected_record   = r;
    },
    set_filter_store: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    clear_filter_store: (state) => {
      state.filter_search   = "";
      state.filter_status   = "all";
      state.filter_category = null;
      state.filter_deleted  = false;
      state.current_page    = 0;
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
} = productsStore.actions

export default productsStore.reducer
