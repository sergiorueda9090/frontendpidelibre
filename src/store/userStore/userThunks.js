import axios from 'axios';
import { URL as BASE_URL } from '../../constants/constantGlogal';
import { close_modal_store } from '../globalStore/globalStore';
import { set_form_store, clear_form_store, get_all_records_store, set_selected_record_store, set_filter_store, set_pagination_store, set_loading_store } from './userStore';
import { alertWarning, alertCreated, alertUpdated, alertDeleted, alertError } from '../../utils/alerts';


// ── Crear usuario ─────────────────────────────────────────────────────────────
export const create_thunk = () => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const { first_name, last_name, username, password, email, is_active, photo } = getState().userStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('first_name', first_name.trim());
      form.append('last_name',  last_name.trim());
      form.append('username',   username.trim());
      form.append('password',   password);
      form.append('is_active',  is_active);
      if (email) form.append('email', email.trim());

      // Adjuntar imagen solo si el usuario seleccionó un archivo nuevo
      if (photo instanceof File) {
        form.append('profile_image', photo);
      }

      const response = await axios.post(
        `${BASE_URL}api/user/create/`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 201) {
        alertCreated('Usuario');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al crear usuario', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.detail || 'Ocurrió un error al crear el usuario.';
      alertError('Error al crear usuario', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Obtener todos los usuarios ────────────────────────────────────────────────
export const get_all_thunk = () => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const token = getState().authStore.accessToken;
    const { current_page, page_size } = getState().userStore;

    try {
      const response = await axios.get(`${BASE_URL}api/user/all/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: current_page + 1, page_size },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los usuarios.';
      alertError('Error al cargar usuarios', msg);
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


// ── Actualizar usuario ────────────────────────────────────────────────────────
export const update_thunk = () => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const { id, first_name, last_name, username, password, email, is_active, photo, selected_record } = getState().userStore;
    const token = getState().authStore.accessToken;

    try {
      const form = new FormData();
      form.append('first_name', first_name.trim());
      form.append('last_name',  last_name.trim());
      form.append('username',   username.trim());
      form.append('is_active',  is_active);
      if (email) form.append('email', email.trim());
      if (password) form.append('password', password);

      // Si el usuario eligió una imagen nueva, enviarla
      if (photo instanceof File) {
        form.append('profile_image', photo);
      }

      const response = await axios.put(
        `${BASE_URL}api/user/${id}/update/`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      // Si el usuario quitó la imagen (X) y el registro tenía una → eliminarla de S3
      if (photo === null && selected_record?.profile_image) {
        try {
          await axios.delete(`${BASE_URL}api/user/${id}/image/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (_) { /* silenciado: el registro principal ya se actualizó */ }
      }

      dispatch(close_modal_store());
      dispatch(clear_form_store());

      if (response.status === 200) {
        alertUpdated('Usuario');
        dispatch(get_all_thunk());
      } else {
        alertWarning('Error al actualizar', 'Ocurrió un error. Intenta nuevamente.');
      }

    } catch (error) {
      dispatch(clear_form_store());
      const msg = error.response?.data?.detail || 'Ocurrió un error al actualizar el usuario.';
      alertError('Error al actualizar usuario', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar usuario (+ imagen en S3) ────────────────────────────────────────
export const delete_thunk = (id) => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const token = getState().authStore.accessToken;

    try {
      await axios.delete(`${BASE_URL}api/user/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Usuario');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar el usuario.';
      alertError('Error al eliminar usuario', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Eliminar solo la imagen de perfil ────────────────────────────────────────
export const delete_image_thunk = (id) => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const token = getState().authStore.accessToken;

    try {
      await axios.delete(`${BASE_URL}api/user/${id}/image/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alertDeleted('Imagen de perfil');
      dispatch(get_all_thunk());
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al eliminar la imagen.';
      alertError('Error al eliminar imagen', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};


// ── Helpers de formulario y filtros ──────────────────────────────────────────
export const set_form_store_thunk = (payload) => (dispatch) => {
  dispatch(set_form_store(payload));
};

export const get_filter_thunk = () => {
  return async (dispatch, getState) => {

    dispatch(set_loading_store(true));

    const token = getState().authStore.accessToken;
    const { filter_status, filter_start_date, filter_end_date, filter_search, current_page, page_size } = getState().userStore;

    let is_active;
    if      (filter_status === 'active')   is_active = true;
    else if (filter_status === 'inactive') is_active = false;

    try {
      const response = await axios.get(`${BASE_URL}api/user/all/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search:     filter_search     || undefined,
          start_date: filter_start_date || undefined,
          end_date:   filter_end_date   || undefined,
          is_active,
          page:       current_page + 1,
          page_size,
        },
      });
      dispatch(get_all_records_store({ records: response.data.results }));
      dispatch(set_pagination_store({ total_count: response.data.count }));
    } catch (error) {
      const msg = error.response?.data?.detail || 'Ocurrió un error al obtener los usuarios.';
      alertError('Error al cargar usuarios', msg);
    } finally {
      dispatch(set_loading_store(false));
    }
  };
};

export const set_filter_store_thunk = (payload) => (dispatch) => {
  dispatch(set_filter_store(payload));
};
