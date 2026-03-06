import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './customerStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear cliente ─────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { first_name, last_name, email, phone, document_number, date_of_birth, gender, is_active } = getState().customerStore;
    const token = getState().authStore.accessToken;

    try {
      const body = {
        first_name:      first_name.trim(),
        last_name:       last_name.trim(),
        email:           email.trim(),
        is_active,
      };
      if (phone)           body.phone           = phone.trim();
      if (document_number) body.document_number  = document_number.trim();
      if (date_of_birth)   body.date_of_birth    = date_of_birth;
      if (gender)          body.gender            = gender;

      const response = await api.post('api/customer/create/', body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Cliente');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el cliente.';
      alertError('Error al crear cliente', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los clientes ────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().customerStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/customer/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los clientes.';
      alertError('Error al cargar clientes', msg);
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


// ── Actualizar cliente ────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { id, first_name, last_name, email, phone, document_number, date_of_birth, gender, is_active } = getState().customerStore;
    const token = getState().authStore.accessToken;

    try {
      const body = {
        first_name:      first_name.trim(),
        last_name:       last_name.trim(),
        email:           email.trim(),
        is_active,
      };
      if (phone)           body.phone           = phone.trim();
      if (document_number) body.document_number  = document_number.trim();
      if (date_of_birth)   body.date_of_birth    = date_of_birth;
      if (gender)          body.gender            = gender;
      else                 body.gender            = null;

      const response = await api.put(`api/customer/${id}/update/`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Cliente');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el cliente.';
      alertError('Error al actualizar cliente', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de cliente ────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/customer/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Cliente');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el cliente.';
      alertError('Error al eliminar cliente', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().customerStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/customer/all/', {
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
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los clientes.';
      alertError('Error al cargar clientes', msg);
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
