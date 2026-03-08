import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // campos del formulario
  id              : null,
  logo            : null,
  provider        : "mercadopago",
  name            : "",
  description     : "",
  public_key      : "",
  access_token    : "",
  secret_key      : "",
  client_id       : "",
  webhook_secret  : "",
  extra_config    : {},
  environment     : "sandbox",
  is_active       : true,
  order           : 0,
  currency        : "COP",
  supported_countries : [],

  // lista y registro seleccionado
  data            : [],
  selected_record : null,

  // filtros
  filter_search      : "",
  filter_status      : "all",   // "all" | "active" | "inactive"
  filter_environment : "all",   // "all" | "sandbox" | "production"
  filter_deleted     : false,

  // paginado
  total_count  : 0,
  current_page : 0,
  page_size    : 10,

  // estado de carga
  loading: false,
}

export const metodospagosStore = createSlice({
  name: 'metodospagosStore',
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
      state.id                  = null;
      state.logo                = null;
      state.provider            = "mercadopago";
      state.name                = "";
      state.description         = "";
      state.public_key          = "";
      state.access_token        = "";
      state.secret_key          = "";
      state.client_id           = "";
      state.webhook_secret      = "";
      state.extra_config        = {};
      state.environment         = "sandbox";
      state.is_active           = true;
      state.order               = 0;
      state.currency            = "COP";
      state.supported_countries = [];
      state.selected_record     = null;
    },
    set_selected_record_store: (state, action) => {
      const r = action.payload;
      state.id                  = r.id                  || null;
      state.logo                = r.logo                || null;
      state.provider            = r.provider            || "mercadopago";
      state.name                = r.name                || "";
      state.description         = r.description         || "";
      state.public_key          = r.public_key          || "";
      state.access_token        = r.access_token        || "";
      state.secret_key          = r.secret_key          || "";
      state.client_id           = r.client_id           || "";
      state.webhook_secret      = r.webhook_secret      || "";
      state.extra_config        = r.extra_config        || {};
      state.environment         = r.environment         || "sandbox";
      state.is_active           = r.is_active !== undefined ? r.is_active : true;
      state.order               = r.order               || 0;
      state.currency            = r.currency            || "COP";
      state.supported_countries = r.supported_countries  || [];
      state.selected_record     = r;
    },
    set_filter_store: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    clear_filter_store: (state) => {
      state.filter_search      = "";
      state.filter_status      = "all";
      state.filter_environment = "all";
      state.filter_deleted     = false;
      state.current_page       = 0;
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
} = metodospagosStore.actions

export default metodospagosStore.reducer
