import axios from 'axios';
import { URL as BASE_URL } from '../../constants/constantGlogal';
import { setCredentials, logout, setLoading, setError, decodeJwt, set_form_store, set_field_errors_store } from './authStore';
import { alertWarning } from '../../utils/alerts';

// ── Timer de expiración ────────────────────────────────────────────────────
// Variable de módulo: solo hay un timer activo a la vez.
let _expiryTimer = null;

/**
 * Programa el cierre de sesión automático cuando el access token expire.
 * Cancela cualquier timer previo antes de crear uno nuevo.
 */
function scheduleAutoLogout(dispatch, navigate, msUntilExpiry) {
  clearTimeout(_expiryTimer);
  _expiryTimer = setTimeout(async () => {
    _expiryTimer = null;
    dispatch(logout());
    await alertWarning(
      'Sesión expirada',
      'Tu sesión ha caducado por inactividad. Inicia sesión nuevamente.',
    );
    navigate?.('/login', { replace: true });
  }, msUntilExpiry);
}

// ── Thunks públicos ────────────────────────────────────────────────────────

/**
 * Autentica al usuario contra el backend.
 * - POST /api/token/ con FormData (username, password)
 * - GET  /api/user/me/ para obtener el perfil
 * - Guarda tokens y usuario en Redux + localStorage
 * - Programa el auto-logout al vencer el token
 */
export function getAuth(username, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // 1. Obtener tokens JWT
      const form = new FormData();
      form.append('username', username.trim());
      form.append('password', password);

      const { data: tokens } = await axios.post(`${BASE_URL}api/token/`, form);
      const { access: accessToken, refresh: refreshToken } = tokens;

      // 2. Obtener perfil del usuario autenticado
      const { data: rawUser } = await axios.get(`${BASE_URL}api/user/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Normalizar full_name para compatibilidad con los componentes de la UI
      const user = {
        ...rawUser,
        full_name:
          rawUser.full_name ||
          [rawUser.first_name, rawUser.last_name].filter(Boolean).join(' ') ||
          rawUser.username,
      };

      // 3. Persistir en Redux y localStorage
      dispatch(setCredentials({ user, accessToken, refreshToken }));

      // 4. Programar auto-logout al vencer el token
      const decoded = decodeJwt(accessToken);
      if (decoded?.exp) {
        const msUntilExpiry = decoded.exp * 1000 - Date.now();
        if (msUntilExpiry > 0) scheduleAutoLogout(dispatch, navigate, msUntilExpiry);
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      const msg =
        error.response?.data?.detail ??
        error.response?.data?.non_field_errors?.[0] ??
        'Credenciales incorrectas. Verifica tu usuario y contraseña.';
      dispatch(setError(msg));
    }
  };
}

/**
 * Cierra la sesión manualmente (botón de logout).
 * Cancela el timer de expiración y limpia el estado.
 */
export function doLogout(navigate) {
  return (dispatch) => {
    clearTimeout(_expiryTimer);
    _expiryTimer = null;
    dispatch(logout());
    navigate?.('/login', { replace: true });
  };
}

/**
 * Debe llamarse una vez al iniciar la app (en SessionGuard).
 * Si hay un token válido en el store, reactiva el timer de auto-logout.
 * Si el token ya expiró, cierra sesión inmediatamente.
 */
export function initSessionTimer(dispatch, navigate, accessToken) {
  if (!accessToken) return;

  const decoded = decodeJwt(accessToken);
  if (!decoded?.exp) return;

  const msUntilExpiry = decoded.exp * 1000 - Date.now();

  if (msUntilExpiry <= 0) {
    // El token expiró mientras la app estaba cerrada
    dispatch(logout());
    navigate?.('/login', { replace: true });
    return;
  }

  scheduleAutoLogout(dispatch, navigate, msUntilExpiry);
}

export const set_form_store_thunk = (field, value) => {
  return (dispatch) => {
    dispatch(set_form_store({ field, value }));
  }
}

export const set_field_errors_store_thunk = (fieldErrors) => {
  return (dispatch) => {
    dispatch(set_field_errors_store(fieldErrors));
  }
}