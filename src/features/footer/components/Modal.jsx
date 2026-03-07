import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk } from '../../../store/footerStore/footerThunks';
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
import DescriptionOutlinedIcon        from '@mui/icons-material/DescriptionOutlined';
import PhoneOutlinedIcon              from '@mui/icons-material/PhoneOutlined';
import LabelOutlinedIcon              from '@mui/icons-material/LabelOutlined';
import EmailOutlinedIcon              from '@mui/icons-material/EmailOutlined';
import CopyrightOutlinedIcon          from '@mui/icons-material/CopyrightOutlined';
import FacebookOutlinedIcon           from '@mui/icons-material/Facebook';
import LinkOutlinedIcon               from '@mui/icons-material/LinkOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import CloudUploadOutlinedIcon        from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon              from '@mui/icons-material/DeleteOutline';
import { useDropzone } from 'react-dropzone';

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

function FooterDropzone({ value, onChange, readOnly, accentColor, label }) {
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
              width: 280, height: 120, borderRadius: 2.5,
              border: `2px solid ${alpha(accentColor, 0.2)}`,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', p: 1.5,
            }}
          >
            <Box
              component="img"
              src={preview}
              alt={label}
              sx={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain',
              }}
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
        mb: 1, p: 2.5, borderRadius: 2.5,
        border: `2px dashed ${isDragActive ? accentColor : alpha(accentColor, 0.3)}`,
        bgcolor: isDragActive
          ? alpha(accentColor, 0.08)
          : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        cursor: readOnly ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75,
        '&:hover': readOnly ? {} : {
          borderColor: accentColor,
          bgcolor: alpha(accentColor, 0.06),
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadOutlinedIcon sx={{ fontSize: 30, color: alpha(accentColor, 0.6) }} />
      <Typography variant="body2" fontWeight={600} color="text.secondary" textAlign="center">
        {isDragActive ? 'Suelta la imagen aquí' : label}
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

export default function FooterModal({ open, onClose, onSave, footer, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const {
    id, logo, description, facebook_url, twitter_url, linkedin_url, instagram_url,
    phone, phone_label, email, copyright_text, payment_image, is_active,
  } = useSelector((s) => s.footerStore);

  const isEditing = Boolean(footer?.id);
  const [errors, setErrors] = useState({});

  useEffect(() => { setErrors({}); }, [open]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!description.trim()) errs.description = 'La descripción es requerida';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      id: footer?.id, logo, description, facebook_url, twitter_url, linkedin_url,
      instagram_url, phone, phone_label, email, copyright_text, payment_image, is_active,
    });
  };

  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const modalTitle  = readOnly ? 'Detalle del footer' : isEditing ? 'Editar footer' : 'Nuevo footer';
  const modalSubtitle = readOnly
    ? 'Información del footer'
    : isEditing
      ? 'Modifica los datos del footer'
      : 'Completa el formulario para registrar un nuevo footer';

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
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>{modalTitle}</Typography>
              <Typography
                variant="body2" color="text.secondary"
                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {modalSubtitle}
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

          {/* Imágenes */}
          <SectionLabel>Imágenes</SectionLabel>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <Box flex={1}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Logo
              </Typography>
              <FooterDropzone
                value={logo}
                onChange={(val) => dispatch(set_form_store_thunk({ name: 'logo', value: val }))}
                readOnly={readOnly}
                accentColor={accentColor}
                label="Arrastra el logo o haz clic"
              />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Métodos de pago
              </Typography>
              <FooterDropzone
                value={payment_image}
                onChange={(val) => dispatch(set_form_store_thunk({ name: 'payment_image', value: val }))}
                readOnly={readOnly}
                accentColor={accentColor}
                label="Arrastra la imagen de pagos o haz clic"
              />
            </Box>
          </Stack>

          {/* Contenido principal */}
          <SectionLabel>Contenido</SectionLabel>
          <Stack gap={2.5}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required={!readOnly}
              multiline
              rows={2}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Texto de copyright"
              name="copyright_text"
              value={copyright_text}
              onChange={handleChange}
              placeholder="Ej: pidelibre.com — Todos los derechos reservados."
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <CopyrightOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Contacto */}
          <SectionLabel>Contacto</SectionLabel>
          <Stack gap={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={phone}
                onChange={handleChange}
                placeholder="Ej: +123 456 7890"
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
                label="Texto sobre teléfono"
                name="phone_label"
                value={phone_label}
                onChange={handleChange}
                placeholder="Ej: ¿Tienes preguntas? Llámanos"
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LabelOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="Ej: info@pidelibre.com"
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Redes sociales */}
          <SectionLabel>Redes sociales</SectionLabel>
          <Stack gap={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                fullWidth
                label="Facebook URL"
                name="facebook_url"
                value={facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Twitter URL"
                name="twitter_url"
                value={twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin_url"
                value={linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Instagram URL"
                name="instagram_url"
                value={instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Estado */}
          <SectionLabel>Estado</SectionLabel>
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
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear footer'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
