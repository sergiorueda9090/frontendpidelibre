import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_products_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './sliderStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear slider ─────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      title, subtitle, discount_percentage, offer_text, button_text,
      product, custom_url, custom_image, bg_color, is_light, order, is_active,
    } = getState().sliderStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('title',       title.trim());
      form.append('is_active',   is_active);
      form.append('is_light',    is_light);
      form.append('order',       order);
      form.append('bg_color',    bg_color);
      form.append('button_text', button_text.trim());
      if (subtitle)            form.append('subtitle',            subtitle.trim());
      if (discount_percentage !== "" && discount_percentage !== null) form.append('discount_percentage', discount_percentage);
      if (offer_text)          form.append('offer_text',          offer_text.trim());
      if (product)             form.append('product',             product);
      if (custom_url)          form.append('custom_url',          custom_url.trim());
      if (custom_image instanceof File) form.append('custom_image', custom_image);

      const response = await api.post('api/slider/create/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Slider');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el slider.';
      alertError('Error al crear slider', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los sliders ────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().sliderStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/slider/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los sliders.';
      alertError('Error al cargar sliders', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Cargar registro seleccionado en el form ──────────────────────────────────
export const get_selected_record_thunk = (record) => {
  return (dispatch) => {
    dispatch(set_selected_record_store(record));
  };
};


// ── Actualizar slider ────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      id, title, subtitle, discount_percentage, offer_text, button_text,
      product, custom_url, custom_image, bg_color, is_light, order, is_active,
      selected_record,
    } = getState().sliderStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('title',       title.trim());
      form.append('is_active',   is_active);
      form.append('is_light',    is_light);
      form.append('order',       order);
      form.append('bg_color',    bg_color);
      form.append('button_text', button_text.trim());
      if (subtitle)            form.append('subtitle',            subtitle.trim());
      if (discount_percentage !== "" && discount_percentage !== null) form.append('discount_percentage', discount_percentage);
      if (offer_text)          form.append('offer_text',          offer_text.trim());
      if (product)             form.append('product',             product);
      else                     form.append('product',             '');
      if (custom_url)          form.append('custom_url',          custom_url.trim());
      if (custom_image instanceof File) form.append('custom_image', custom_image);

      const response = await api.put(`api/slider/${id}/update/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si se quitó la imagen y el registro tenía una → eliminarla de S3
      if (custom_image === null && selected_record?.custom_image) {
        try {
          await api.delete(`api/slider/${id}/image/`);
        } catch (_) { /* silenciado */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Slider');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el slider.';
      alertError('Error al actualizar slider', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de slider ────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/slider/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Slider');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el slider.';
      alertError('Error al eliminar slider', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar solo la imagen del slider ───────────────────────────────────────
export const delete_image_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    try {
      await api.delete(`api/slider/${id}/image/`);
      alertDeleted('Imagen del slider');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar la imagen.';
      alertError('Error al eliminar imagen', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener productos para el selector ───────────────────────────────────────
export const get_products_thunk = () => {
  return async (dispatch, getState) => {
    const token = getState().authStore.accessToken;
    try {
      const response = await api.get('api/product/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 },
      });
      dispatch(set_products_store(response.data.results || []));
    } catch (error) {
      /* silenciado: los productos son opcionales */
    }
  };
};


// ── Filtros y búsqueda ───────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().sliderStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/slider/all/', {
        params: {
          search:    filter_search || undefined,
          is_active,
          deleted:   filter_deleted ? 'true' : undefined,
          page:      current_page + 1,
          page_size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los sliders.';
      alertError('Error al cargar sliders', msg);
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
