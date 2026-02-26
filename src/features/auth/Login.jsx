import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button,
  IconButton, InputAdornment, Stack, CircularProgress, Alert, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon      from '@mui/icons-material/Visibility';
import VisibilityOffIcon   from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon   from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon    from '@mui/icons-material/LockOutlined';
import StorefrontIcon      from '@mui/icons-material/Storefront';
import InventoryIcon       from '@mui/icons-material/Inventory';
import GroupIcon           from '@mui/icons-material/Group';
import BarChartIcon        from '@mui/icons-material/BarChart';
import PaletteIcon         from '@mui/icons-material/Palette';
import { getAuth, set_form_store_thunk, set_field_errors_store_thunk } from '../../store/authStore/authThunks';
import { clearError }      from '../../store/authStore/authStore';

const FEATURES = [
  { icon: <BarChartIcon fontSize="small" />,  text: 'Dashboard con métricas en tiempo real' },
  { icon: <GroupIcon fontSize="small" />,     text: 'Gestión de usuarios y clientes' },
  { icon: <InventoryIcon fontSize="small" />, text: 'Control de pedidos e inventario' },
  { icon: <PaletteIcon fontSize="small" />,   text: 'Personalización visual del panel' },
];

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const muiTheme  = useTheme();

  const { loading, error, username, password, showpassword, fieldErrors } = useSelector((s) => s.authStore);

  const primary = muiTheme.palette.primary.main;

  // ── Validación local ──────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = 'El usuario es requerido';
    if (!password.trim()) errs.password = 'La contraseña es requerida';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { set_field_errors_store_thunk(errs); return; }
    set_field_errors_store_thunk({});
    dispatch(getAuth(username, password, navigate));
  };

  const handleUsernameChange = (e) => {
    dispatch(set_form_store_thunk('username', e.target.value));
    if (fieldErrors.username) set_field_errors_store_thunk((p) => ({ ...p, username: '' }));
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (e) => {
    dispatch(set_form_store_thunk('password', e.target.value));
    if (fieldErrors.password) set_field_errors_store_thunk((p) => ({ ...p, password: '' }));
    if (error) dispatch(clearError());
  };

  const handleShowPassword = () => {
    dispatch(set_form_store_thunk('showpassword', !showpassword));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>

      {/* ── Panel izquierdo — Branding ──────────────────────────────────── */}
      <Box
        sx={{
          display        : { xs: 'none', md: 'flex' },
          flexDirection  : 'column',
          justifyContent : 'center',
          width          : '45%',
          flexShrink     : 0,
          position       : 'relative',
          overflow       : 'hidden',
          background     : 'linear-gradient(145deg, #4F46E5 0%, #6366F1 45%, #7C3AED 100%)',
          p              : 6,
        }}
      >
        {/* Círculos decorativos */}
        {[
          { top: -80,  right: -80,  size: 320, opacity: 0.06 },
          { bottom: -60, left: -60, size: 240, opacity: 0.06 },
          { top: '40%', right: -40, size: 160, opacity: 0.04 },
        ].map((c, i) => (
          <Box key={i} sx={{ position: 'absolute', ...c, width: c.size, height: c.size, borderRadius: '50%', bgcolor: alpha('#fff', c.opacity) }} />
        ))}

        {/* Logo */}
        <Stack direction="row" alignItems="center" gap={1.5} mb={6}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: alpha('#fff', 0.18), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StorefrontIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#fff" lineHeight={1.1}>pidelibre</Typography>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), letterSpacing: '0.08em' }}>PANEL ADMINISTRATIVO</Typography>
          </Box>
        </Stack>

        <Typography variant="h4" fontWeight={800} color="#fff" lineHeight={1.3} mb={2}>
          Gestiona tu<br />e-commerce con<br />total control.
        </Typography>
        <Typography variant="body1" sx={{ color: alpha('#fff', 0.75), mb: 5, maxWidth: 340, lineHeight: 1.7 }}>
          Todo lo que necesitas para administrar tu tienda en un solo lugar.
        </Typography>

        <Stack gap={2.5}>
          {FEATURES.map((f, i) => (
            <Stack key={i} direction="row" alignItems="center" gap={1.75}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, flexShrink: 0, bgcolor: alpha('#fff', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {f.icon}
              </Box>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.85), fontWeight: 500 }}>{f.text}</Typography>
            </Stack>
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: alpha('#fff', 0.45), mt: 'auto', pt: 6 }}>
          © {new Date().getFullYear()} pidelibre.com — Todos los derechos reservados
        </Typography>
      </Box>

      {/* ── Panel derecho — Formulario ─────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 } }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          {/* Logo móvil */}
          <Stack direction="row" alignItems="center" gap={1.5} mb={4} sx={{ display: { md: 'none' } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorefrontIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} color="primary.main">pidelibre</Typography>
          </Stack>

          <Typography variant="h5" fontWeight={800} mb={0.75}>Iniciar sesión</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Ingresa tus credenciales para acceder al panel
          </Typography>

          {/* Error de autenticación (del backend) */}
          {error && (
            <Alert
              severity="error"
              onClose={() => dispatch(clearError())}
              sx={{ mb: 3, borderRadius: 2, fontSize: '0.85rem' }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <Stack gap={2.5}>

              <TextField
                fullWidth
                label="Usuario"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
                autoComplete="username"
                autoFocus
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type={showpassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                autoComplete="current-password"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleShowPassword((v) => !v)} edge="end" tabIndex={-1} disabled={loading}>
                        {showpassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                disableElevation
                size="large"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  py         : 1.35,
                  fontWeight : 700,
                  fontSize   : '0.95rem',
                  borderRadius: '10px',
                  background : 'linear-gradient(135deg, #4F46E5, #6366F1)',
                  boxShadow  : `0 4px 18px ${alpha(primary, 0.4)}`,
                  '&:hover'  : {
                    background: 'linear-gradient(135deg, #4338CA, #4F46E5)',
                    boxShadow : `0 6px 24px ${alpha(primary, 0.5)}`,
                  },
                  '&.Mui-disabled': { opacity: 0.7 },
                  transition : 'all 0.2s ease',
                }}
              >
                {loading ? 'Verificando...' : 'Ingresar al panel'}
              </Button>

            </Stack>
          </Box>

          {/* Pie de página */}
          <Paper
            variant="outlined"
            sx={{ mt: 4, p: 1.5, borderRadius: 2, borderColor: 'divider', textAlign: 'center' }}
          >
            <Typography variant="caption" color="text.disabled">
              Acceso restringido. Solo personal autorizado.
            </Typography>
          </Paper>

        </Box>
      </Box>
    </Box>
  );
}
