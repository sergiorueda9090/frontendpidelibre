import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem, CircularProgress,
  Box, Typography, IconButton, Avatar, InputAdornment, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import ImageUploader from '../../components/common/ImageUploader';
import { getInitials } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

const CITIES = [
  'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro',
  'Tijuana', 'Mérida', 'Culiacán', 'Chihuahua', 'León', 'Otra',
];

const EMPTY = { name: '', email: '', phone: '', city: '', status: 'active', photo: null };

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

/* ─── Componente ──────────────────────────────────────────────── */
export default function ClientModal({ open, onClose, onSave, client, saving, readOnly = false }) {
  const theme = useTheme();
  const isEditing = Boolean(client?.id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(client
      ? { name: client.name, email: client.email, phone: client.phone || '', city: client.city || '', status: client.status, id: client.id, photo: client.photo || null }
      : EMPTY
    );
    setErrors({});
  }, [client, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.email.trim()) errs.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Correo inválido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  /* Identidad visual según modo */
  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : PersonAddOutlinedIcon;
  const title    = readOnly ? 'Detalle de cliente' : isEditing ? 'Editar cliente' : 'Nuevo cliente';
  const subtitle = readOnly
    ? `Información de ${client?.name}`
    : isEditing
      ? `Modifica los datos de ${client?.name}`
      : 'Completa el formulario para registrar un nuevo cliente';

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth={false}
      fullWidth
      TransitionComponent={React.forwardRef((props, ref) => {
        const { children, in: inProp, ...rest } = props;
        return (
          <div
            ref={ref}
            style={{
              transition: 'opacity 250ms ease, transform 250ms ease',
              opacity: inProp ? 1 : 0,
              transform: inProp ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
            }}
            {...rest}
          >
            {children}
          </div>
        );
      })}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 660,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 60px rgba(0,0,0,0.6)'
            : '0 25px 60px rgba(0,0,0,0.18)',
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
      <DialogContent sx={{ px: 3, py: 0, pb: 1, position: 'relative' }}>
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
            value={form.photo}
            onChange={(v) => setForm((prev) => ({ ...prev, photo: v }))}
            readOnly={readOnly}
            initials={getInitials(form.name)}
            size={100}
          />
        </Box>

        {/* Sección: Información personal */}
        <SectionLabel>Información personal</SectionLabel>
        <Stack gap={2.5}>
          <TextField
            fullWidth
            label="Nombre completo"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
            value={form.email}
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
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+52 55 0000 0000"
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth select
              label="Ciudad"
              name="city"
              value={form.city}
              onChange={handleChange}
              inputProps={{ readOnly }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCityOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            >
              {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Stack>
        </Stack>

        {/* Sección: Estado */}
        <SectionLabel>Estado de cuenta</SectionLabel>
        <Stack pb={2}>
          <TextField
            fullWidth select
            label="Estado"
            name="status"
            value={form.status}
            onChange={handleChange}
            inputProps={{ readOnly }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RadioButtonCheckedOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          >
            {STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
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
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar cliente'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
