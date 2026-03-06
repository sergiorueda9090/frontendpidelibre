import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk } from '../../../store/customerStore/customerThunks';
import { get_all_thunk as get_all_genders_thunk } from '../../../store/genderStore/genderThunks';
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
import PersonOutlinedIcon             from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon              from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon              from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon              from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon      from '@mui/icons-material/CalendarMonthOutlined';
import WcOutlinedIcon                 from '@mui/icons-material/WcOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';

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

export default function CustomerModal({ open, onClose, onSave, customer, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const { id, first_name, last_name, email, phone, document_number, date_of_birth, gender, is_active } =
    useSelector((s) => s.customerStore);

  const genders = useSelector((s) => s.genderStore.data);

  const isEditing = Boolean(customer?.id);
  const [errors, setErrors] = useState({});

  useEffect(() => { setErrors({}); }, [open]);

  useEffect(() => {
    if (open && genders.length === 0) {
      dispatch(get_all_genders_thunk());
    }
  }, [open, genders.length, dispatch]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!first_name.trim()) errs.first_name = 'El nombre es requerido';
    if (!last_name.trim())  errs.last_name  = 'El apellido es requerido';
    if (!email.trim())      errs.email      = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ id: customer?.id, first_name, last_name, email, phone, document_number, date_of_birth, gender, is_active });
  };

  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const title       = readOnly ? 'Detalle de cliente' : isEditing ? 'Editar cliente' : 'Nuevo cliente';
  const subtitle    = readOnly
    ? `Información de ${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`
    : isEditing
      ? `Modifica los datos de ${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`
      : 'Completa el formulario para registrar un nuevo cliente';

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
            width: '100%', maxWidth: 620, maxHeight: '90vh',
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

          {/* Información personal */}
          <SectionLabel>Información personal</SectionLabel>
          <Stack gap={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
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
            </Stack>

            <TextField
              fullWidth
              label="Email"
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

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={phone}
                onChange={handleChange}
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
                fullWidth
                label="Documento"
                name="document_number"
                value={document_number}
                onChange={handleChange}
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5}>
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                name="date_of_birth"
                type="date"
                value={date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth select
                label="Género"
                name="gender"
                value={gender || ''}
                onChange={handleChange}
                inputProps={{ readOnly }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WcOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value=""><em>Sin género</em></MenuItem>
                {genders.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          {/* Configuración */}
          <SectionLabel>Configuración</SectionLabel>
          <Stack gap={2.5} pb={2}>
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
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear cliente'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
