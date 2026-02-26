import { createSlice } from '@reduxjs/toolkit';
// ── Utilidades JWT ─────────────────────────────────────────────────────────

/** Decodifica el payload de un JWT sin librerías externas. */
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** Devuelve true si el token existe y su exp todavía no ha pasado. */
export function isTokenValid(token) {
  if (!token) return false;
  const decoded = decodeJwt(token);
  return decoded?.exp ? decoded.exp * 1000 > Date.now() : false;
}

// ── Persistencia en localStorage ──────────────────────────────────────────

const STORAGE_KEY = 'pidelibre-auth';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Si el access token expiró, limpiamos y devolvemos null
    if (!isTokenValid(data?.accessToken)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

const stored = loadFromStorage();

// ── Slice ──────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'authStore',
  initialState: {
    isAuthenticated : !!stored,
    user            : stored?.user        ?? null,
    accessToken     : stored?.accessToken ?? null,
    refreshToken    : stored?.refreshToken ?? null,
    loading         : false,
    error           : null,
    username        : null,
    password        : null,
    showpassword    : false,
    fieldErrors     : {},
  },
  reducers: {
    /** Guarda tokens y datos de usuario tras un login exitoso. */
    setCredentials: (state, { payload }) => {
      const { user, accessToken, refreshToken } = payload;
      state.isAuthenticated = true;
      state.user            = user;
      state.accessToken     = accessToken;
      state.refreshToken    = refreshToken;
      state.loading         = false;
      state.error           = null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }));
    },
    /** Limpia toda la sesión: Redux + localStorage. */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user            = null;
      state.accessToken     = null;
      state.refreshToken    = null;
      state.loading         = false;
      state.error           = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
      if (payload) state.error = null;
    },
    setError: (state, { payload }) => {
      state.error   = payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    set_form_store: (state, { payload }) => {
      const { field, value } = payload;
      state[field] = value;
    },
    set_field_errors_store: (state, { payload }) => {
      state.fieldErrors = payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError, set_form_store, set_field_errors_store } = authSlice.actions;

// Exportación nombrada para compatibilidad con store.js: import { authStore } from './authStore/authStore'
export const authStore = authSlice;

export default authSlice.reducer;
