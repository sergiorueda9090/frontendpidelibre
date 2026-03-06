import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './featureAreaStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear feature ────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { icon, title, description, order, is_active } = getState().featureAreaStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.post('api/tp-feature-area/create/', {
        icon:        icon.trim(),
        title:       title.trim(),
        description: description.trim(),
        order,
        is_active,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Feature');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el feature.';
      alertError('Error al crear feature', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los features ───────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().featureAreaStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/tp-feature-area/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los features.';
      alertError('Error al cargar features', msg);
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


// ── Actualizar feature ───────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, icon, title, description, order, is_active } = getState().featureAreaStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.put(`api/tp-feature-area/${id}/update/`, {
        icon:        icon.trim(),
        title:       title.trim(),
        description: description.trim(),
        order,
        is_active,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Feature');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el feature.';
      alertError('Error al actualizar feature', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de feature ───────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/tp-feature-area/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Feature');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el feature.';
      alertError('Error al eliminar feature', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ───────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().featureAreaStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/tp-feature-area/all/', {
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
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los features.';
      alertError('Error al cargar features', msg);
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
