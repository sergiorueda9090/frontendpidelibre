import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './brandStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear marca ──────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { name, slug, logo, description, is_active } = getState().brandStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('name',      name.trim());
      form.append('slug',      slug.trim());
      form.append('is_active', is_active);
      if (description)        form.append('description', description.trim());
      if (logo instanceof File) form.append('logo', logo);

      const response = await api.post('api/brand/create/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Marca');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear la marca.';
      alertError('Error al crear marca', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todas las marcas ─────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().brandStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/brand/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener las marcas.';
      alertError('Error al cargar marcas', msg);
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


// ── Actualizar marca ─────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, name, slug, logo, description, is_active, selected_record } = getState().brandStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('name',      name.trim());
      form.append('slug',      slug.trim());
      form.append('is_active', is_active);
      if (description)          form.append('description', description.trim());
      if (logo instanceof File) form.append('logo', logo);

      const response = await api.put(`api/brand/${id}/update/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si se quitó el logo y el registro tenía uno → eliminarlo de S3
      if (logo === null && selected_record?.logo) {
        try {
          await api.delete(`api/brand/${id}/logo/`);
        } catch (_) { /* silenciado: el registro principal ya se actualizó */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Marca');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar la marca.';
      alertError('Error al actualizar marca', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de marca ─────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/brand/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Marca');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar la marca.';
      alertError('Error al eliminar marca', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar solo el logo de marca ───────────────────────────────────────────
export const delete_logo_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    try {
      await api.delete(`api/brand/${id}/logo/`);
      alertDeleted('Logo de marca');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el logo.';
      alertError('Error al eliminar logo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ───────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().brandStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/brand/all/', {
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
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener las marcas.';
      alertError('Error al cargar marcas', msg);
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
