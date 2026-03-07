import api from '../../services/axiosInstance';
import { close_modal_store } from '../globalStore/globalStore';
import {
  set_form_store, clear_form_store, get_all_records_store,
  set_selected_record_store, set_filter_store,
  set_pagination_store, set_loading_store,
} from './footerStore';
import { alertCreated, alertUpdated, alertDeleted, alertError, alertWarning } from '../../utils/alerts';


// ── Crear footer ──────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      description, facebook_url, twitter_url, linkedin_url, instagram_url,
      phone, phone_label, email, copyright_text, logo, payment_image, is_active,
    } = getState().footerStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('description',    description.trim());
      form.append('is_active',      is_active);
      if (facebook_url)   form.append('facebook_url',   facebook_url.trim());
      if (twitter_url)    form.append('twitter_url',    twitter_url.trim());
      if (linkedin_url)   form.append('linkedin_url',   linkedin_url.trim());
      if (instagram_url)  form.append('instagram_url',  instagram_url.trim());
      if (phone)          form.append('phone',          phone.trim());
      if (phone_label)    form.append('phone_label',    phone_label.trim());
      if (email)          form.append('email',          email.trim());
      if (copyright_text) form.append('copyright_text', copyright_text.trim());
      if (logo instanceof File)          form.append('logo',          logo);
      if (payment_image instanceof File) form.append('payment_image', payment_image);

      const response = await api.post('api/footer/create/', form);

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Footer');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el footer.';
      alertError('Error al crear footer', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los footers ─────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { current_page, page_size } = getState().footerStore;
    const token = getState().authStore.accessToken;

    try {
      const response = await api.get('api/footer/all/', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los footers.';
      alertError('Error al cargar footers', msg);
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


// ── Actualizar footer ─────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const {
      id, description, facebook_url, twitter_url, linkedin_url, instagram_url,
      phone, phone_label, email, copyright_text, logo, payment_image, is_active,
      selected_record,
    } = getState().footerStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('description', description.trim());
      form.append('is_active',   is_active);
      if (facebook_url)   form.append('facebook_url',   facebook_url.trim());
      if (twitter_url)    form.append('twitter_url',    twitter_url.trim());
      if (linkedin_url)   form.append('linkedin_url',   linkedin_url.trim());
      if (instagram_url)  form.append('instagram_url',  instagram_url.trim());
      if (phone)          form.append('phone',          phone.trim());
      if (phone_label)    form.append('phone_label',    phone_label.trim());
      if (email)          form.append('email',          email.trim());
      if (copyright_text) form.append('copyright_text', copyright_text.trim());
      if (logo instanceof File)          form.append('logo',          logo);
      if (payment_image instanceof File) form.append('payment_image', payment_image);

      const response = await api.put(`api/footer/${id}/update/`, form);

      // Si se quitó el logo y el registro tenía uno → eliminar de S3
      if (logo === null && selected_record?.logo) {
        try { await api.delete(`api/footer/${id}/image/logo/`); } catch (_) { /* silenciado */ }
      }
      // Si se quitó payment_image y el registro tenía una → eliminar de S3
      if (payment_image === null && selected_record?.payment_image) {
        try { await api.delete(`api/footer/${id}/image/payment/`); } catch (_) { /* silenciado */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Footer');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el footer.';
      alertError('Error al actualizar footer', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Soft delete de footer ─────────────────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));
    const token = getState().authStore.accessToken;
    try {
      await api.delete(`api/footer/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Footer');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el footer.';
      alertError('Error al eliminar footer', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Filtros y búsqueda ────────────────────────────────────────────────────────
export const get_filter_thunk = () => {
  return async (dispatch, getState) => {
    dispatch(set_loading_store(true));

    const { filter_search, filter_status, filter_deleted, current_page, page_size } = getState().footerStore;
    const token = getState().authStore.accessToken;
    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await api.get('api/footer/all/', {
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
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los footers.';
      alertError('Error al cargar footers', msg);
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
