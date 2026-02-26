import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './attributeValuesStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear valor de atributo ────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { attribute, value, color_hex, order } = getState().attributeValuesStore;
    const token = getState().authStore.accessToken;

    try {
      const payload = {
        attribute,
        value: value.trim(),
        order,
      };
      if (color_hex) payload.color_hex = color_hex.trim();

      const response = await api.post(
        'api/attribute-value/create/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Valor de atributo');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el valor de atributo.';
      alertError('Error al crear valor de atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los valores de atributo ──────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().attributeValuesStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/attribute-value/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los valores de atributo.';
      alertError('Error al cargar valores de atributo', msg);
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


// ── Actualizar valor de atributo ───────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, value, color_hex, order } = getState().attributeValuesStore;
    const token = getState().authStore.accessToken;

    try {
      const payload = { value: value.trim(), order };
      if (color_hex) payload.color_hex = color_hex.trim();
      else           payload.color_hex = null;

      const response = await api.put(
        `api/attribute-value/${id}/update/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Valor de atributo');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el valor de atributo.';
      alertError('Error al actualizar valor de atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de valor de atributo ──────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;

    try {
      await api.delete(
        `api/attribute-value/${id}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alertDeleted('Valor de atributo');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el valor de atributo.';
      alertError('Error al eliminar valor de atributo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ─────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_attribute, filter_deleted, current_page, page_size } =
      getState().attributeValuesStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/attribute-value/all/', {
        params: {
          search:       filter_search    || undefined,
          attribute_id: filter_attribute || undefined,
          deleted:      filter_deleted   ? 'true' : undefined,
          page:         current_page + 1,
          page_size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los valores de atributo.';
      alertError('Error al cargar valores de atributo', msg);
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
