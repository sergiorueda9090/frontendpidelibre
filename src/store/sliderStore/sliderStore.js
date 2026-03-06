import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // campos del formulario
  id                  : null,
  custom_image        : null,
  title               : "",
  subtitle            : "",
  discount_percentage : "",
  offer_text          : "off this week",
  button_text         : "Shop Now",
  product             : null,   // id del producto o null
  custom_url          : "",
  bg_color            : "#0989FF",
  is_light            : false,
  order               : 0,
  is_active           : true,

  // lista y registro seleccionado
  data             : [],
  selected_record  : null,

  // lista de productos disponibles (para el selector)
  products         : [],

  // filtros
  filter_search  : "",
  filter_status  : "all",   // "all" | "active" | "inactive"
  filter_deleted : false,   // false = activas | true = eliminadas (soft delete)

  // paginado
  total_count  : 0,
  current_page : 0,   // 0-indexed
  page_size    : 10,

  // estado de carga
  loading: false,
}

export const sliderStore = createSlice({
  name: 'sliderStore',
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
      state.custom_image        = null;
      state.title               = "";
      state.subtitle            = "";
      state.discount_percentage = "";
      state.offer_text          = "off this week";
      state.button_text         = "Shop Now";
      state.product             = null;
      state.custom_url          = "";
      state.bg_color            = "#0989FF";
      state.is_light            = false;
      state.order               = 0;
      state.is_active           = true;
      state.selected_record     = null;
    },
    set_selected_record_store: (state, action) => {
      const r = action.payload;
      state.id                  = r.id                  || null;
      state.custom_image        = r.custom_image        || null;
      state.title               = r.title               || "";
      state.subtitle            = r.subtitle            || "";
      state.discount_percentage = r.discount_percentage  ?? "";
      state.offer_text          = r.offer_text           || "off this week";
      state.button_text         = r.button_text          || "Shop Now";
      state.product             = r.product?.id          ?? null;
      state.custom_url          = r.custom_url           || "";
      state.bg_color            = r.bg_color             || "#0989FF";
      state.is_light            = r.is_light             !== undefined ? r.is_light : false;
      state.is_active           = r.is_active            !== undefined ? r.is_active : true;
      state.order               = r.order                ?? 0;
      state.selected_record     = r;
    },
    set_products_store: (state, action) => {
      state.products = action.payload;
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
  clear_form_store, set_selected_record_store, set_products_store,
  set_filter_store, clear_filter_store,
  set_pagination_store, set_loading_store,
} = sliderStore.actions

export default sliderStore.reducer
