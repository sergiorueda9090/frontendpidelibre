import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DashboardLayout  from '../components/layout/DashboardLayout';
import Dashboard        from '../features/dashboard/Dashboard';
import Users            from '../features/users/Users';
import Customer         from '../features/customer/Customer';
import Categories       from '../features/categories/Categories';
import Attributes       from '../features/attributes/attributes';
import AttributesValues from '../features/attributesValues/attributesValues';
import Products         from '../features/products/Products';
import Brand            from '../features/brand/Categories';
import Gender           from '../features/gender/Categories';
import Slider           from '../features/slider/Slider';
import ThemeCustomizer  from '../theme/ThemeCustomizer';
import Login            from '../features/auth/Login';
import { initSessionTimer } from '../store/authStore/authThunks';

// ── SessionGuard ──────────────────────────────────────────────────────────
// Reactiva el timer de auto-logout al recargar la página si hay sesión activa.
// Debe estar dentro de <BrowserRouter> para poder usar useNavigate.
function SessionGuard() {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const accessToken  = useSelector((s) => s.authStore.accessToken);

  useEffect(() => {
    initSessionTimer(dispatch, navigate, accessToken);
    // Solo se ejecuta en el montaje inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ── Ruta privada: redirige a /login si no está autenticado ───────────────
function RequireAuth() {
  const isAuthenticated = useSelector((s) => s.authStore.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// ── Ruta pública: redirige al dashboard si ya está autenticado ───────────
function PublicOnly() {
  const isAuthenticated = useSelector((s) => s.authStore.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <SessionGuard />
      <Routes>
        {/* Públicas */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Privadas */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"       element={<Dashboard />} />
            <Route path="/usuarios"        element={<Users />} />
            <Route path="/clientes"        element={<Customer />} />
            <Route path="/categorias"      element={<Categories />} />
            <Route path="/atributos"          element={<Attributes />} />
            <Route path="/valores-atributos" element={<AttributesValues />} />
            <Route path="/productos"         element={<Products />} />
            <Route path="/marcas"            element={<Brand />} />
            <Route path="/generos"           element={<Gender />} />
            <Route path="/sliders"           element={<Slider />} />
            <Route path="/personalizacion"   element={<ThemeCustomizer />} />
          </Route>
        </Route>

        {/* Redirecciones */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
