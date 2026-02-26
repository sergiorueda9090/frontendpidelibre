import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './categoryStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear categoría ───────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { name, slug, image, parent, is_active, order, meta_title, meta_description } = getState().categoryStore;

    try {
      const form = new FormData();
      form.append('name',      name.trim());
      form.append('slug',      slug.trim());
      form.append('is_active', is_active);
      form.append('order',     order);
      if (parent)           form.append('parent',           parent);
      if (meta_title)       form.append('meta_title',       meta_title.trim());
      if (meta_description) form.append('meta_description', meta_description.trim());
      if (image instanceof File) form.append('image', image);

      const response = await api.post('api/category/create/', form);

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Categoría');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear la categoría.';
      alertError('Error al crear categoría', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todas las categorías ──────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().categoryStore;

    try {
      const response = await api.get('api/category/all/', {
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener las categorías.';
      alertError('Error al cargar categorías', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Cargar registro seleccionado en el form ───────────────────────────────────
export const get_selected_record_thunk = (record) => {
  return (dispatch) => {
    dispatch(set_selected_record_store(record));
  };
};


// ── Actualizar categoría ──────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, name, slug, image, parent, is_active, order, meta_title, meta_description, selected_record } = getState().categoryStore;

    try {
      const form = new FormData();
      form.append('name',      name.trim());
      form.append('slug',      slug.trim());
      form.append('is_active', is_active);
      form.append('order',     order);
      if (parent)           form.append('parent',           parent);
      if (meta_title)       form.append('meta_title',       meta_title.trim());
      if (meta_description) form.append('meta_description', meta_description.trim());
      if (image instanceof File) form.append('image', image);

      const response = await api.put(`api/category/${id}/update/`, form);

      // Si se quitó la imagen y el registro tenía una → eliminarla de S3
      if (image === null && selected_record?.image) {
        try {
          await api.delete(`api/category/${id}/image/`);
        } catch (_) { /* silenciado: el registro principal ya se actualizó */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Categoría');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar la categoría.';
      alertError('Error al actualizar categoría', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de categoría ──────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    try {
      await api.delete(`api/category/${id}/delete/`);
      alertDeleted('Categoría');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar la categoría.';
      alertError('Error al eliminar categoría', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar solo la imagen de categoría ──────────────────────────────────────
export const delete_image_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    try {
      await api.delete(`api/category/${id}/image/`);
      alertDeleted('Imagen de categoría');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar la imagen.';
      alertError('Error al eliminar imagen', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().categoryStore;

    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/category/all/', {
        params: {
          search:    filter_search || undefined,
          is_active,
          deleted:   filter_deleted ? 'true' : undefined,
          page:      current_page + 1,
          page_size,
        },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener las categorías.';
      alertError('Error al cargar categorías', msg);
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
