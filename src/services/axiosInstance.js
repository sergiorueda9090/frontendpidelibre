import axios from 'axios';
import { URL as BASE_URL } from '../constants/constantGlogal';

/**
 * Instancia Axios preconfigurada para el backend.
 * - Adjunta automáticamente el header Authorization con el access token.
 * - Ante un 401, despacha logout y limpia el estado de autenticación.
 *
 * Uso: importar `api` en lugar de `axios` en todos los thunks de la app.
 */
const api = axios.create({ baseURL: BASE_URL });

// Referencia al store inyectada desde index.js para evitar dependencias circulares.
let _store;
export const injectStore = (store) => { _store = store; };

// ── Request: añade el token si existe ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = _store?.getState()?.authStore?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: ante 401, cierra sesión automáticamente ────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && _store) {
      // Usa el tipo de acción directamente para evitar import circular con authStore
      _store.dispatch({ type: 'authStore/logout' });
    }
    return Promise.reject(error);
  },
);

export default api;
