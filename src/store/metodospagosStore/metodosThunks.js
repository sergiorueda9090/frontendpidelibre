import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './metodospagosStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear metodo de pago ─────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      provider, name, description, logo, public_key, access_token,
      secret_key, client_id, webhook_secret, extra_config,
      environment, is_active, order, currency, supported_countries,
    } = getState().metodospagosStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('provider',     provider);
      form.append('name',         name.trim());
      form.append('environment',  environment);
      form.append('is_active',    is_active);
      form.append('order',        order);
      form.append('currency',     currency);
      form.append('access_token', access_token.trim());
      if (description)           form.append('description',  description.trim());
      if (public_key)            form.append('public_key',   public_key.trim());
      if (secret_key)            form.append('secret_key',   secret_key.trim());
      if (client_id)             form.append('client_id',    client_id.trim());
      if (webhook_secret)        form.append('webhook_secret', webhook_secret.trim());
      if (logo instanceof File)  form.append('logo', logo);
      if (supported_countries.length) form.append('supported_countries', JSON.stringify(supported_countries));
      if (Object.keys(extra_config).length) form.append('extra_config', JSON.stringify(extra_config));

      const response = await api.post('api/metodos-pagos/create/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Metodo de pago');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrio un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrio un error al crear el metodo de pago.';
      alertError('Error al crear metodo de pago', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los metodos de pago ────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().metodospagosStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/metodos-pagos/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrio un error al obtener los metodos de pago.';
      alertError('Error al cargar metodos de pago', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Cargar registro seleccionado en el form (trae detalle completo con credenciales) ─
export const get_selected_record_thunk = (record) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      const response = await api.get(`api/metodos-pagos/${record.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(set_selected_record_store(response.data));
    } catch (error) {
      // Fallback: usar los datos del listado si falla el detalle
      dispatch(set_selected_record_store(record));
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Actualizar metodo de pago ────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      id, provider, name, description, logo, public_key, access_token,
      secret_key, client_id, webhook_secret, extra_config,
      environment, is_active, order, currency, supported_countries, selected_record,
    } = getState().metodospagosStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('provider',     provider);
      form.append('name',         name.trim());
      form.append('environment',  environment);
      form.append('is_active',    is_active);
      form.append('order',        order);
      form.append('currency',     currency);
      form.append('access_token', access_token.trim());
      if (description)           form.append('description',  description.trim());
      if (public_key)            form.append('public_key',   public_key.trim());
      if (secret_key)            form.append('secret_key',   secret_key.trim());
      if (client_id)             form.append('client_id',    client_id.trim());
      if (webhook_secret)        form.append('webhook_secret', webhook_secret.trim());
      if (logo instanceof File)  form.append('logo', logo);
      if (supported_countries.length) form.append('supported_countries', JSON.stringify(supported_countries));
      if (Object.keys(extra_config).length) form.append('extra_config', JSON.stringify(extra_config));

      const response = await api.put(`api/metodos-pagos/${id}/update/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si se quito el logo y el registro tenia uno -> eliminarlo de S3
      if (logo === null && selected_record?.logo) {
        try {
          await api.delete(`api/metodos-pagos/${id}/image/logo/`);
        } catch (_) { /* silenciado */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Metodo de pago');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrio un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrio un error al actualizar el metodo de pago.';
      alertError('Error al actualizar metodo de pago', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de metodo de pago ────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/metodos-pagos/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Metodo de pago');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrio un error al eliminar el metodo de pago.';
      alertError('Error al eliminar metodo de pago', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar solo el logo ────────────────────────────────────────────────────
export const delete_logo_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    try {
      await api.delete(`api/metodos-pagos/${id}/image/logo/`);
      alertDeleted('Logo del metodo de pago');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrio un error al eliminar el logo.';
      alertError('Error al eliminar logo', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y busqueda ───────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_environment, filter_deleted, current_page, page_size } = getState().metodospagosStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/metodos-pagos/all/', {
        params: {
          search:      filter_search      || undefined,
          is_active,
          environment: filter_environment !== 'all' ? filter_environment : undefined,
          deleted:     filter_deleted ? 'true' : undefined,
          page:        current_page + 1,
          page_size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrio un error al obtener los metodos de pago.';
      alertError('Error al cargar metodos de pago', msg);
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
