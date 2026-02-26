import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './attributeStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear atributo ─────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { name } = getState().attributeStore;
    const token    = getState().authStore.accessToken;
    
    try {
      const response = await api.post('api/attribute/create/', 
                                      { name: name.trim() }, 
                                      { headers:{ Authorization: `Bearer ${token}`, 
                                                  'Content-Type': 'multipart/form-data' 
                                                } 
                                      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Atributo');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el atributo.';
      alertError('Error al crear atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los atributos ────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().attributeStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/attribute/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los atributos.';
      alertError('Error al cargar atributos', msg);
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


// ── Actualizar atributo ────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, name } = getState().attributeStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.put(`api/attribute/${id}/update/`,
                                     { name: name.trim() },
                                     { headers: { Authorization: `Bearer ${token}` } });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Atributo');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el atributo.';
      alertError('Error al actualizar atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de atributo ────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/attribute/${id}/delete/`,
           {
            headers: { Authorization: `Bearer ${token}` },
           }
      );
      alertDeleted('Atributo');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el atributo.';
      alertError('Error al eliminar atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ─────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_deleted, current_page, page_size } = getState().attributeStore;
    const token    = getState().authStore.accessToken;
    try {
      const response = await api.get('api/attribute/all/', {
        params: {
          search:  filter_search || undefined,
          deleted: filter_deleted ? 'true' : undefined,
          page:    current_page + 1,
          page_size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los atributos.';
      alertError('Error al cargar atributos', msg);
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
