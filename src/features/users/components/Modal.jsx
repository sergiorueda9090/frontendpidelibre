import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk } from '../../../store/userStore/userThunks';
import {
  Dialog, DialogContent, DialogActions, Fade,
  Button, TextField, Stack, MenuItem, CircularProgress,
  Box, Typography, IconButton, Avatar, InputAdornment, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import ImageUploader from '../../../components/common/ImageUploader';
import { getInitials } from '../../../utils/formatters';

const ROLES = [
  { value: 'admin',    label: 'Administrador' },
  { value: 'editor',  label: 'Editor' },
  { value: 'customer', label: 'Cliente' },
];
const STATUS_OPTIONS = [
  { value: true,   label: 'Activo' },
  { value: false,  label: 'Inactivo' },
];

/* ─── Etiqueta de sección ─────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      fontWeight={700}
      color="text.disabled"
      sx={{ letterSpacing: '0.1em', mb: 1.5, mt: 3, display: 'block', fontSize: '0.7rem' }}
    >
      {children}
    </Typography>
  );
}

/* ─── keyframes para el Paper (efecto slide-up al abrir) ─── */
const paperEnterKeyframes = `
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`;

/* ─── Componente ──────────────────────────────────────────────── */
export default function UserModal({ open, onClose, onSave, user="", saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const { id, photo, first_name, last_name, username, password, password_repeat, email, phone, role, is_active } = useSelector((s) => s.userStore);

  const isEditing = Boolean(user?.id);
  const [errors, setErrors] = useState({});

  // Limpiar errores al abrir/cerrar
  useEffect(() => { setErrors({}); }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(set_form_store_thunk({ name, value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (value) => {
    dispatch(set_form_store_thunk({ name: 'photo', value }));
  };

  const validate = () => {
    const errs = {};
    if (!first_name.trim()) errs.first_name = 'El nombre es requerido';
    if (!last_name.trim()) errs.last_name = 'El apellido es requerido';
    if (!email.trim())     errs.email     = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Correo inválido';
    if (!isEditing) {
      if (!password)               errs.password        = 'La contraseña es requerida';
      if (!password_repeat)        errs.password_repeat = 'Repite la contraseña';
      else if (password !== password_repeat) errs.password_repeat = 'Las contraseñas no coinciden';
    } else if (password && password !== password_repeat) {
      errs.password_repeat = 'Las contraseñas no coinciden';
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ id: user?.id, photo, first_name, last_name, username, email, phone, role, is_active, ...(password && { password }) });
  };

  /* Identidad visual según modo */
  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : PersonAddOutlinedIcon;
  const title    = readOnly ? 'Detalle de usuario' : isEditing ? 'Editar usuario' : 'Nuevo usuario';
  const displayName = user?.first_name + ' ' + user?.last_name ?? user?.name ?? '';
  const subtitle = readOnly
    ? `Información de ${displayName}`
    : isEditing
      ? `Modifica los datos de ${displayName}`
      : 'Completa el formulario para registrar un nuevo usuario';

  return (
    <>
      <style>{paperEnterKeyframes}</style>
      <Dialog
        open={open}
        onClose={saving ? undefined : onClose}
        maxWidth={false}
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={220}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 660,
            maxHeight: '90vh',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 60px rgba(0,0,0,0.6)'
              : '0 25px 60px rgba(0,0,0,0.18)',
            animation: open ? 'modalSlideIn 220ms ease forwards' : 'none',
          },
        }}
      >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background: `linear-gradient(135deg, ${alpha(accentColor, 0.12)} 0%, ${alpha(accentColor, 0.04)} 100%)`,
          borderBottom: `1px solid ${alpha(accentColor, 0.15)}`,
          position: 'relative',
        }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              bgcolor: accentColor,
              boxShadow: `0 6px 20px ${alpha(accentColor, 0.45)}`,
              flexShrink: 0,
            }}
          >
            <ModeIcon sx={{ fontSize: 26 }} />
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {subtitle}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            disabled={saving}
            sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.06),
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.12) },
              flexShrink: 0,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Contenido ── */}
      <DialogContent
        sx={{
          px: 3,
          py: 0,
          pb: 1,
          position: 'relative',
          flex: 1,
          overflowY: 'auto',
          /* Firefox */
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(accentColor, 0.45)} transparent`,
          /* Webkit (Chrome, Edge, Safari) */
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(accentColor, 0.07),
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(accentColor, 0.38),
            borderRadius: 10,
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            transition: 'background-color 0.25s ease',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(accentColor, 0.62),
          },
          '&::-webkit-scrollbar-thumb:active': {
            backgroundColor: accentColor,
          },
        }}
      >
        {/* Overlay de guardado */}
        {saving && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              backdropFilter: 'blur(3px)',
              bgcolor: alpha(theme.palette.background.paper, 0.75),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <CircularProgress size={40} sx={{ color: accentColor }} />
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Guardando cambios...
            </Typography>
          </Box>
        )}

        {/* Sección: Foto de perfil */}
        <SectionLabel>Foto de perfil</SectionLabel>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <ImageUploader
            value={photo}
            onChange={handlePhotoChange}
            readOnly={readOnly}
            initials={getInitials(first_name + ' ' + last_name)}
            size={100}
          />
        </Box>

        {/* Sección: Información personal */}
        <SectionLabel>Información personal</SectionLabel>
        <Stack gap={2.5}>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Nombre"
            name="first_name"
            value={first_name}
            onChange={handleChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Apellido"
            name="last_name"
            value={last_name}
            onChange={handleChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Repeat Password"
            name="password_repeat"
            type="password"
            value={password_repeat}
            onChange={handleChange}
            error={!!errors.password_repeat}
            helperText={errors.password_repeat}
            required={!readOnly}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  <LockResetOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

        </Stack>

        {/* Sección: Acceso y permisos */}
        <SectionLabel>Acceso y permisos</SectionLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} pb={2}>
          <TextField
            fullWidth select
            label="Rol"
            name="role"
            value={role}
            onChange={handleChange}
            inputProps={{ readOnly }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          >
            {ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </TextField>
          <TextField
              fullWidth
              select
              label="Estado"
              name="is_active"
              value={is_active}
              onChange={handleChange}
              inputProps={{ readOnly }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RadioButtonCheckedOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: is_active ? 'success.main' : 'text.disabled'
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            >
              {STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
        </Stack>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2.25,
          gap: 1.5,
          borderTop: `1px solid ${alpha(accentColor, 0.15)}`,
          background: `linear-gradient(135deg, ${alpha(accentColor, 0.07)} 0%, ${alpha(accentColor, 0.03)} 100%)`,
          justifyContent: readOnly ? 'center' : 'flex-end',
        }}
      >
        {readOnly ? (
          <Button
            variant="contained"
            onClick={onClose}
            disableElevation
            sx={{
              px: 4,
              fontWeight: 700,
              borderRadius: '10px',
              bgcolor: accentColor,
              '&:hover': { bgcolor: accentColor, filter: 'brightness(1.1)' },
            }}
          >
            Cerrar
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={saving}
              sx={{ borderRadius: '10px', fontWeight: 600, px: 2.5 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              disableElevation
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                px: 3,
                bgcolor: accentColor,
                boxShadow: `0 4px 14px ${alpha(accentColor, 0.4)}`,
                '&:hover': {
                  bgcolor: accentColor,
                  filter: 'brightness(1.1)',
                  boxShadow: `0 6px 20px ${alpha(accentColor, 0.5)}`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </>
        )}
      </DialogActions>
      </Dialog>
    </>
  );
}
