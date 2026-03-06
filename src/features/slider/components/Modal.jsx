import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk, get_products_thunk } from '../../../store/sliderStore/sliderThunks';
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
import TitleOutlinedIcon              from '@mui/icons-material/TitleOutlined';
import SubtitlesOutlinedIcon          from '@mui/icons-material/SubtitlesOutlined';
import PercentOutlinedIcon            from '@mui/icons-material/PercentOutlined';
import LocalOfferOutlinedIcon         from '@mui/icons-material/LocalOfferOutlined';
import TouchAppOutlinedIcon           from '@mui/icons-material/TouchAppOutlined';
import ShoppingBagOutlinedIcon        from '@mui/icons-material/ShoppingBagOutlined';
import LinkOutlinedIcon               from '@mui/icons-material/LinkOutlined';
import PaletteOutlinedIcon            from '@mui/icons-material/PaletteOutlined';
import SortOutlinedIcon               from '@mui/icons-material/SortOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import LightModeOutlinedIcon          from '@mui/icons-material/LightModeOutlined';
import CloudUploadOutlinedIcon        from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon              from '@mui/icons-material/DeleteOutline';
import { useDropzone } from 'react-dropzone';

const STATUS_OPTIONS = [
  { value: true,  label: 'Activo' },
  { value: false, label: 'Inactivo' },
];

const LIGHT_OPTIONS = [
  { value: false, label: 'Oscuro (texto claro)' },
  { value: true,  label: 'Claro (texto oscuro)' },
];

const paperEnterKeyframes = `
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`;

function SliderDropzone({ value, onChange, readOnly, accentColor }) {
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
              width: 320, height: 180, borderRadius: 2.5,
              border: `2px solid ${alpha(accentColor, 0.2)}`,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', p: 1.5,
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Slider"
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
        {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra la imagen del slider o haz clic para seleccionar'}
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

export default function SliderModal({ open, onClose, onSave, slider, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const {
    id, custom_image, title, subtitle, discount_percentage, offer_text,
    button_text, product, custom_url, bg_color, is_light, order, is_active,
    products,
  } = useSelector((s) => s.sliderStore);

  const isEditing = Boolean(slider?.id);
  const [errors, setErrors] = useState({});

  useEffect(() => { setErrors({}); }, [open]);

  useEffect(() => {
    if (open) dispatch(get_products_thunk());
  }, [open, dispatch]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (value) => {
    dispatch(set_form_store_thunk({ name: 'custom_image', value }));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'El título es requerido';
    if (bg_color && !/^#[0-9A-Fa-f]{6}$/.test(bg_color)) errs.bg_color = 'Color hexadecimal inválido (ej: #0989FF)';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      id: slider?.id, custom_image, title, subtitle, discount_percentage,
      offer_text, button_text, product, custom_url, bg_color, is_light, order, is_active,
    });
  };

  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const modalTitle  = readOnly ? 'Detalle del slider' : isEditing ? 'Editar slider' : 'Nuevo slider';
  const modalSubtitle = readOnly
    ? `Información de ${slider?.title ?? ''}`
    : isEditing
      ? `Modifica los datos de ${slider?.title ?? ''}`
      : 'Completa el formulario para registrar un nuevo slider';

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

          {/* Imagen */}
          <SectionLabel>Imagen del slider</SectionLabel>
          <SliderDropzone
            value={custom_image}
            onChange={handleImageChange}
            readOnly={readOnly}
            accentColor={accentColor}
          />

          {/* Contenido principal */}
          <SectionLabel>Contenido</SectionLabel>
          <Stack gap={2.5}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required={!readOnly}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Subtítulo"
              name="subtitle"
              value={subtitle}
              onChange={handleChange}
              placeholder='Ej: Starting at $274.00'
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <SubtitlesOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                fullWidth
                label="% Descuento"
                name="discount_percentage"
                type="number"
                value={discount_percentage}
                onChange={handleChange}
                placeholder="Ej: 35"
                inputProps={{ readOnly, min: 0, max: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PercentOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Texto de oferta"
                name="offer_text"
                value={offer_text}
                onChange={handleChange}
                placeholder="Ej: off this week"
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Texto del botón"
              name="button_text"
              value={button_text}
              onChange={handleChange}
              placeholder="Ej: Shop Now"
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <TouchAppOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Vinculación */}
          <SectionLabel>Vinculación</SectionLabel>
          <Stack gap={2.5}>
            <TextField
              select fullWidth
              label="Producto vinculado"
              name="product"
              value={product ?? ''}
              onChange={e => dispatch(set_form_store_thunk({ name: 'product', value: e.target.value || null }))}
              inputProps={{ readOnly }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value=""><em>Sin producto vinculado</em></MenuItem>
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="URL personalizada"
              name="custom_url"
              value={custom_url}
              onChange={handleChange}
              placeholder="Ej: /shop o /ofertas"
              helperText="Se usa cuando no hay producto vinculado"
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

          {/* Apariencia */}
          <SectionLabel>Apariencia</SectionLabel>
          <Stack gap={2.5} pb={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <TextField
                fullWidth
                label="Color de fondo"
                name="bg_color"
                value={bg_color}
                onChange={handleChange}
                error={!!errors.bg_color}
                helperText={errors.bg_color || 'Formato: #RRGGBB'}
                InputProps={{
                  readOnly,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 20, height: 20, borderRadius: '4px',
                            bgcolor: bg_color || '#ccc',
                            border: '1px solid', borderColor: 'divider',
                          }}
                        />
                        <PaletteOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth select
                label="Modo de texto"
                name="is_light"
                value={is_light}
                onChange={handleChange}
                inputProps={{ readOnly }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LightModeOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {LIGHT_OPTIONS.map((o) => (
                  <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
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
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear slider'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
