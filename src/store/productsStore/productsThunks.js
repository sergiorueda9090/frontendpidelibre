import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './productsStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear producto ─────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      name, slug, image, category, description, short_description,
      price, compare_price, cost_price, sku, stock,
      is_active, is_featured, is_new, meta_title, meta_description,
    } = getState().productsStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('name',      name.trim());
      form.append('slug',      slug.trim());
      form.append('is_active',  is_active);
      form.append('is_featured', is_featured);
      form.append('is_new',     is_new);
      if (category)          form.append('category',          category);
      if (description)       form.append('description',       description.trim());
      if (short_description) form.append('short_description', short_description.trim());
      if (price !== "")      form.append('price',             price);
      if (compare_price !== "") form.append('compare_price',  compare_price);
      if (cost_price !== "")    form.append('cost_price',     cost_price);
      if (sku)               form.append('sku',               sku.trim());
      if (stock !== "")      form.append('stock',             stock);
      if (meta_title)        form.append('meta_title',        meta_title.trim());
      if (meta_description)  form.append('meta_description',  meta_description.trim());
      if (image instanceof File) form.append('image', image);

      const response = await api.post('api/product/create/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());
      alertCreated('Producto');
      dispatch(get_all_thunk());

    } catch (error) {
      // NO limpiar el form en error: el usuario debe poder corregir y reintentar
      const errors = error.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el producto.';
      alertError('Error al crear producto', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los productos ────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().productsStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/product/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los productos.';
      alertError('Error al cargar productos', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Cargar registro seleccionado en el form ────────────────────────────────────
export const get_selected_record_thunk = (record) => {
  return (dispatch) => {
    dispatch(set_selected_record_store(record));
  };
};


// ── Actualizar producto ────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      id, name, slug, image, category, description, short_description,
      price, compare_price, cost_price, sku, stock,
      is_active, is_featured, is_new, meta_title, meta_description, selected_record,
    } = getState().productsStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('name',       name.trim());
      form.append('slug',       slug.trim());
      form.append('is_active',  is_active);
      form.append('is_featured', is_featured);
      form.append('is_new',     is_new);
      if (category)          form.append('category',          category);
      if (description)       form.append('description',       description.trim());
      if (short_description) form.append('short_description', short_description.trim());
      if (price !== "")      form.append('price',             price);
      if (compare_price !== "") form.append('compare_price',  compare_price);
      if (cost_price !== "")    form.append('cost_price',     cost_price);
      if (sku)               form.append('sku',               sku.trim());
      if (stock !== "")      form.append('stock',             stock);
      if (meta_title)        form.append('meta_title',        meta_title.trim());
      if (meta_description)  form.append('meta_description',  meta_description.trim());
      if (image instanceof File) form.append('image', image);

      const response = await api.put(`api/product/${id}/update/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si se quitó la imagen y el registro tenía una → no llamamos delete separado
      // (el backend maneja la imagen directamente en el update con FormData)

      dispatch(close_modal_store());
      dispatch(clear_form_store());
      alertUpdated('Producto');
      dispatch(get_all_thunk());

    } catch (error) {
      // NO limpiar el form en error: el usuario debe poder corregir y reintentar
      const errors = error.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al actualizar el producto.';
      alertError('Error al actualizar producto', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de producto ────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/product/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Producto');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el producto.';
      alertError('Error al eliminar producto', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ─────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_category, filter_deleted, current_page, page_size } =
      getState().productsStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/product/all/', {
        params: {
          search:      filter_search    || undefined,
          is_active,
          category_id: filter_category  || undefined,
          deleted:     filter_deleted   ? 'true' : undefined,
          page:        current_page + 1,
          page_size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los productos.';
      alertError('Error al cargar productos', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};

export const set_form_store_thunk = (payload) => (dispatch) => {
  dispatch(set_form_store(payload));
};

export const set_filter_store_thunk = (payload) => (dispatch) => {
  dispatch(set_filter_store(payload));
};
