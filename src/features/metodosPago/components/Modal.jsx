import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk } from '../../../store/metodospagosStore/metodosThunks';
import {
  Dialog, DialogContent, DialogActions, Fade,
  Button, TextField, Stack, MenuItem, CircularProgress,
  Box, Typography, IconButton, Avatar, InputAdornment, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon                      from '@mui/icons-material/Close';
import AddCircleOutlineIcon           from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon               from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon         from '@mui/icons-material/VisibilityOutlined';
import PaymentOutlinedIcon            from '@mui/icons-material/PaymentOutlined';
import AbcOutlinedIcon                from '@mui/icons-material/AbcOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import DescriptionOutlinedIcon        from '@mui/icons-material/DescriptionOutlined';
import VpnKeyOutlinedIcon             from '@mui/icons-material/VpnKeyOutlined';
import PublicOutlinedIcon             from '@mui/icons-material/PublicOutlined';
import SortOutlinedIcon               from '@mui/icons-material/SortOutlined';
import { useDropzone } from 'react-dropzone';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const PROVIDER_OPTIONS = [
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'wompi',       label: 'Wompi' },
  { value: 'paypal',      label: 'PayPal' },
  { value: 'stripe',      label: 'Stripe' },
  { value: 'other',       label: 'Otro' },
];

const ENVIRONMENT_OPTIONS = [
  { value: 'sandbox',    label: 'Sandbox / Pruebas' },
  { value: 'production', label: 'Produccion' },
];

const STATUS_OPTIONS = [
  { value: true,  label: 'Activo' },
  { value: false, label: 'Inactivo' },
];

const paperEnterKeyframes = `
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`;

function LogoDropzone({ value, onChange, readOnly, name, accentColor }) {
  const theme = useTheme();
  const preview = value instanceof File ? URL.createObjectURL(value) : value || null;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
    maxFiles: 1,
    disabled: readOnly,
    onDrop: (accepted) => {
      if (accepted.length > 0) onChange(accepted[0]);
    },
  });

  useEffect(() => {
    return () => {
      if (value instanceof File && preview) URL.revokeObjectURL(preview);
    };
  }, [value, preview]);

  if (preview) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box
            sx={{
              width: 220, height: 140, borderRadius: 2.5,
              border: `2px solid ${alpha(accentColor, 0.2)}`,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', p: 1.5,
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Logo"
              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
          {!readOnly && (
            <IconButton
              size="small"
              onClick={() => onChange(null)}
              sx={{
                position: 'absolute', top: -10, right: -10,
                bgcolor: 'error.main', color: '#fff',
                width: 28, height: 28,
                '&:hover': { bgcolor: 'error.dark' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      {...getRootProps()}
      sx={{
        mb: 1, p: 3, borderRadius: 2.5,
        border: `2px dashed ${isDragActive ? accentColor : alpha(accentColor, 0.3)}`,
        bgcolor: isDragActive
          ? alpha(accentColor, 0.08)
          : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        cursor: readOnly ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        '&:hover': readOnly ? {} : {
          borderColor: accentColor,
          bgcolor: alpha(accentColor, 0.06),
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: alpha(accentColor, 0.6) }} />
      <Typography variant="body2" fontWeight={600} color="text.secondary" textAlign="center">
        {isDragActive ? 'Suelta la imagen aqui' : 'Arrastra el logo o haz clic para seleccionar'}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        PNG, JPG, SVG o WebP
      </Typography>
    </Box>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline" fontWeight={700} color="text.disabled"
      sx={{ letterSpacing: '0.1em', mb: 1.5, mt: 3, display: 'block', fontSize: '0.7rem' }}
    >
      {children}
    </Typography>
  );
}

export default function MetodosPagoModal({ open, onClose, onSave, record, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const {
    id, logo, provider, name, description, public_key, access_token,
    secret_key, client_id, webhook_secret, environment, is_active,
    order, currency,
  } = useSelector((s) => s.metodospagosStore);

  const isEditing = Boolean(record?.id);
  const [errors, setErrors] = useState({});

  useEffect(() => { setErrors({}); }, [open]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleLogoChange = (value) => {
    dispatch(set_form_store_thunk({ name: 'logo', value }));
  };

  const validate = () => {
    const errs = {};
    if (!name.trim())         errs.name         = 'El nombre es requerido';
    if (!access_token.trim()) errs.access_token  = 'El access token es requerido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ id: record?.id });
  };

  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const title       = readOnly ? 'Detalle del metodo de pago' : isEditing ? 'Editar metodo de pago' : 'Nuevo metodo de pago';
  const subtitle    = readOnly
    ? `Informacion de ${record?.name ?? ''}`
    : isEditing
      ? `Modifica los datos de ${record?.name ?? ''}`
      : 'Completa el formulario para registrar un nuevo metodo de pago';

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
            width: '100%', maxWidth: 680, maxHeight: '90vh',
            borderRadius: 3, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
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
            px: 3, py: 2.5,
            background: `linear-gradient(135deg, ${alpha(accentColor, 0.12)} 0%, ${alpha(accentColor, 0.04)} 100%)`,
            borderBottom: `1px solid ${alpha(accentColor, 0.15)}`,
            position: 'relative',
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 52, height: 52, borderRadius: 2.5,
                bgcolor: accentColor,
                boxShadow: `0 6px 20px ${alpha(accentColor, 0.45)}`,
                flexShrink: 0,
              }}
            >
              <ModeIcon sx={{ fontSize: 26 }} />
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>{title}</Typography>
              <Typography
                variant="body2" color="text.secondary"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {subtitle}
              </Typography>
            </Box>
            <IconButton
              size="small" onClick={onClose} disabled={saving}
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
            px: 3, py: 0, pb: 1,
            flex: 1, overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: `${alpha(accentColor, 0.45)} transparent`,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { background: alpha(accentColor, 0.07), borderRadius: 10 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(accentColor, 0.38), borderRadius: 10,
              border: '2px solid transparent', backgroundClip: 'padding-box',
            },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: alpha(accentColor, 0.62) },
          }}
        >
          {saving && (
            <Box
              sx={{
                position: 'absolute', inset: 0, zIndex: 10,
                backdropFilter: 'blur(3px)',
                bgcolor: alpha(theme.palette.background.paper, 0.75),
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 1.5,
              }}
            >
              <CircularProgress size={40} sx={{ color: accentColor }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Guardando cambios...
              </Typography>
            </Box>
          )}

          {/* Logo */}
          <SectionLabel>Logo de la pasarela</SectionLabel>
          <LogoDropzone
            value={logo}
            onChange={handleLogoChange}
            readOnly={readOnly}
            name={name}
            accentColor={accentColor}
          />

          {/* Informacion principal */}
          <SectionLabel>Informacion principal</SectionLabel>
          <Stack gap={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
              <TextField
                fullWidth select
                label="Proveedor"
                name="provider"
                value={provider}
                onChange={handleChange}
                inputProps={{ readOnly }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {PROVIDER_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth select
                label="Entorno"
                name="environment"
                value={environment}
                onChange={handleChange}
                inputProps={{ readOnly }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {ENVIRONMENT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required={!readOnly}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Descripcion"
              name="description"
              value={description}
              onChange={handleChange}
              multiline
              rows={2}
              inputProps={{ readOnly }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mt: '10px', alignSelf: 'flex-start' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Credenciales */}
          <SectionLabel>Credenciales</SectionLabel>
          <Stack gap={2.5}>
            <TextField
              fullWidth
              label="Public Key"
              name="public_key"
              value={public_key}
              onChange={handleChange}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Access Token"
              name="access_token"
              value={access_token}
              onChange={handleChange}
              error={!!errors.access_token}
              helperText={errors.access_token}
              required={!readOnly}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
              <TextField
                fullWidth
                label="Secret Key"
                name="secret_key"
                value={secret_key}
                onChange={handleChange}
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Client ID"
                name="client_id"
                value={client_id}
                onChange={handleChange}
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Webhook Secret"
              name="webhook_secret"
              value={webhook_secret}
              onChange={handleChange}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Configuracion */}
          <SectionLabel>Configuracion</SectionLabel>
          <Stack gap={2.5} pb={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
              <TextField
                fullWidth
                label="Moneda"
                name="currency"
                value={currency}
                onChange={handleChange}
                inputProps={{ readOnly }}
              />

              <TextField
                fullWidth
                label="Orden"
                name="order"
                type="number"
                value={order}
                onChange={handleChange}
                inputProps={{ readOnly, min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth select
                label="Estado"
                name="is_active"
                value={is_active}
                onChange={handleChange}
                inputProps={{ readOnly }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RadioButtonCheckedOutlinedIcon
                        sx={{ fontSize: 20, color: is_active ? 'success.main' : 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
        </DialogContent>

        {/* ── Footer ── */}
        <DialogActions
          sx={{
            px: 3, py: 2.25, gap: 1.5,
            borderTop: `1px solid ${alpha(accentColor, 0.15)}`,
            background: `linear-gradient(135deg, ${alpha(accentColor, 0.07)} 0%, ${alpha(accentColor, 0.03)} 100%)`,
            justifyContent: readOnly ? 'center' : 'flex-end',
          }}
        >
          {readOnly ? (
            <Button
              variant="contained" onClick={onClose} disableElevation
              sx={{
                px: 4, fontWeight: 700, borderRadius: '10px',
                bgcolor: accentColor,
                '&:hover': { bgcolor: accentColor, filter: 'brightness(1.1)' },
              }}
            >
              Cerrar
            </Button>
          ) : (
            <>
              <Button
                variant="outlined" onClick={onClose} disabled={saving}
                sx={{ borderRadius: '10px', fontWeight: 600, px: 2.5 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained" onClick={handleSubmit} disabled={saving}
                disableElevation
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  borderRadius: '10px', fontWeight: 700, px: 3,
                  bgcolor: accentColor,
                  boxShadow: `0 4px 14px ${alpha(accentColor, 0.4)}`,
                  '&:hover': {
                    bgcolor: accentColor, filter: 'brightness(1.1)',
                    boxShadow: `0 6px 20px ${alpha(accentColor, 0.5)}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear metodo de pago'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
