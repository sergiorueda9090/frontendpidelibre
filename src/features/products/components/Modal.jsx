import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { set_form_store_thunk } from '../../../store/productsStore/productsThunks';
import ProductVariantSection from './ProductVariantSection';
import {
  Dialog, DialogContent, DialogActions, Fade,
  Button, TextField, Stack, MenuItem, CircularProgress,
  Box, Typography, IconButton, Avatar, InputAdornment, alpha, Switch, FormControlLabel,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import CloseIcon                      from '@mui/icons-material/Close';
import AddCircleOutlineIcon           from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon               from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon         from '@mui/icons-material/VisibilityOutlined';
import StorefrontOutlinedIcon         from '@mui/icons-material/StorefrontOutlined';
import AbcOutlinedIcon                from '@mui/icons-material/AbcOutlined';
import CategoryOutlinedIcon           from '@mui/icons-material/CategoryOutlined';
import AttachMoneyOutlinedIcon        from '@mui/icons-material/AttachMoneyOutlined';
import QrCodeOutlinedIcon             from '@mui/icons-material/QrCodeOutlined';
import Inventory2OutlinedIcon         from '@mui/icons-material/Inventory2Outlined';
import TitleOutlinedIcon              from '@mui/icons-material/TitleOutlined';
import DescriptionOutlinedIcon        from '@mui/icons-material/DescriptionOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import ProductImageUploader from './ProductImageUploader';

/* ── Quill config ─────────────────────────────────────────────────────────── */
const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};
const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link'];

const STATUS_OPTIONS = [
  { value: true,  label: 'Activo'   },
  { value: false, label: 'Inactivo' },
];

const paperEnterKeyframes = `
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`;

/* ── Helpers de UI ────────────────────────────────────────────────────────── */
function SectionLabel({ children, first = false }) {
  return (
    <Typography
      variant="overline" fontWeight={700} color="text.disabled"
      sx={{ letterSpacing: '0.1em', mb: 1.5, mt: first ? 1 : 3, display: 'block', fontSize: '0.7rem' }}
    >
      {children}
    </Typography>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */
export default function ProductModal({ open, onClose, onSave, product, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();
  const isDark   = theme.palette.mode === 'dark';

  const {
    id, image, name, slug, category, description, short_description,
    price, compare_price, cost_price, sku, stock,
    is_active, is_featured, is_new, meta_title, meta_description,
  } = useSelector((s) => s.productsStore);

  const categories = useSelector((s) => s.categoryStore.data);
  const token      = useSelector((s) => s.authStore.accessToken);

  const isEditing = Boolean(product?.id);

  const [errors,             setErrors]             = useState({});
  const [images,             setImages]             = useState([]);
  const [slugManuallyEdited, setSlugManuallyEdited]  = useState(false);

  /* Resetea estado local cada vez que el modal abre */
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSlugManuallyEdited(false);

    if (image) {
      const preview = typeof image === 'string' ? image : URL.createObjectURL(image);
      setImages([{ id: 'existing-0', file: null, preview, isNew: false }]);
    } else {
      setImages([]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    dispatch(set_form_store_thunk({ name: 'name', value }));
    // Auto-genera el slug mientras el usuario escribe el nombre
    // (solo si no está editando y el usuario no ha tocado el slug manualmente)
    if (!isEditing && !slugManuallyEdited) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita tildes
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      dispatch(set_form_store_thunk({ name: 'slug', value: autoSlug }));
    }
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    handleChange(e);
  };

  const validate = () => {
    const errs = {};
    if (!name?.trim())  errs.name = 'El nombre es requerido';
    if (!slug?.trim())  errs.slug = 'El slug es requerido';
    else if (!/^[a-z0-9-]+$/.test(slug)) errs.slug = 'Solo minúsculas, números y guiones';
    if (price !== '' && compare_price !== '' && Number(compare_price) <= Number(price)) {
      errs.compare_price = 'Debe ser mayor al precio base';
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const coverImage = images[0]?.file ?? images[0]?.preview ?? null;
    onSave({
      id: product?.id,
      image:  coverImage,
      images: images.map((img) => img.file ?? img.preview),
      name, slug, category, description, short_description,
      price, compare_price, cost_price, sku, stock,
      is_active, is_featured, is_new, meta_title, meta_description,
    });
  };

  /* ── Quill sx adaptado al tema MUI ── */
  const quillSx = (minHeight = 130) => ({
    /* Toolbar */
    '& .ql-toolbar.ql-snow': {
      border:       `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
      borderRadius: '8px 8px 0 0',
      bgcolor:      isDark ? alpha('#fff', 0.03) : alpha(theme.palette.primary.main, 0.03),
      padding:      '6px 8px',
      '& .ql-stroke': { stroke: theme.palette.text.secondary, transition: 'stroke .15s' },
      '& .ql-fill':   { fill:   theme.palette.text.secondary },
      '& .ql-picker':        { color: theme.palette.text.secondary },
      '& .ql-picker-label':  { color: theme.palette.text.secondary },
      '& button:hover .ql-stroke, & .ql-picker-label:hover .ql-stroke': {
        stroke: theme.palette.primary.main,
      },
      '& button.ql-active .ql-stroke': { stroke: theme.palette.primary.main },
      '& button:hover .ql-fill, & button.ql-active .ql-fill': {
        fill: theme.palette.primary.main,
      },
      '& .ql-picker-options': {
        bgcolor:    theme.palette.background.paper,
        border:     `1px solid ${theme.palette.divider}`,
        boxShadow:  theme.shadows[4],
        borderRadius: 1,
        '& .ql-picker-item': { color: theme.palette.text.primary },
      },
    },
    /* Contenedor del editor */
    '& .ql-container.ql-snow': {
      border:       `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
      borderTop:    'none',
      borderRadius: '0 0 8px 8px',
      fontFamily:   theme.typography.fontFamily,
      fontSize:     '0.875rem',
      bgcolor:      theme.palette.background.paper,
    },
    '& .ql-editor': {
      minHeight,
      color: theme.palette.text.primary,
      '&.ql-blank::before': {
        color:      theme.palette.text.disabled,
        fontStyle:  'normal',
        fontSize:   '0.875rem',
      },
      '& p, & li': { color: theme.palette.text.primary },
    },
  });

  /* ReadOnly: sin toolbar, bordes redondeados completos */
  const quillReadOnlySx = (minHeight = 80) => ({
    '& .ql-toolbar.ql-snow': { display: 'none' },
    '& .ql-container.ql-snow': {
      border:       `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      borderRadius: 2,
      fontFamily:   theme.typography.fontFamily,
      fontSize:     '0.875rem',
      bgcolor:      isDark ? alpha('#fff', 0.02) : alpha(theme.palette.action.hover, 0.5),
    },
    '& .ql-editor': {
      minHeight,
      color: theme.palette.text.primary,
    },
  });

  /* ── Colores y títulos contextuales ── */
  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const title       = readOnly ? 'Detalle de producto' : isEditing ? 'Editar producto' : 'Nuevo producto';
  const subtitle    = readOnly
    ? `Información de ${product?.name ?? ''}`
    : isEditing
      ? `Modifica los datos de ${product?.name ?? ''}`
      : 'Completa el formulario para registrar un nuevo producto';

  /* ── Render ── */
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
            width: '100%', maxWidth: 1280, maxHeight: '95vh',
            borderRadius: 3, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: isDark
              ? '0 25px 60px rgba(0,0,0,0.6)'
              : '0 25px 60px rgba(0,0,0,0.18)',
            animation: open ? 'modalSlideIn 220ms ease forwards' : 'none',
          },
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            px: 3.5, py: 2.5,
            background:   `linear-gradient(135deg, ${alpha(accentColor, 0.12)} 0%, ${alpha(accentColor, 0.04)} 100%)`,
            borderBottom: `1px solid ${alpha(accentColor, 0.15)}`,
            flexShrink: 0,
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 52, height: 52, borderRadius: 2.5,
                bgcolor:   accentColor,
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
            px: 3.5, py: 0, pb: 1,
            flex: 1, overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: `${alpha(accentColor, 0.4)} transparent`,
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(accentColor, 0.35), borderRadius: 10,
              border: '2px solid transparent', backgroundClip: 'padding-box',
            },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: alpha(accentColor, 0.6) },
          }}
        >
          {/* Overlay de guardado */}
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

          {/* ── Layout de dos columnas ── */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={3.5}
            pt={1}
            alignItems="flex-start"
          >
            {/* ═══════════════════════════════════════════
                Columna izquierda — Info principal + Fotos
                ═══════════════════════════════════════════ */}
            <Box flex={3} minWidth={0}>

              {/* Imágenes */}
              <SectionLabel first>Imágenes del producto</SectionLabel>
              <ProductImageUploader
                images={images}
                onChange={setImages}
                readOnly={readOnly}
              />

              {/* Info principal */}
              <SectionLabel>Información principal</SectionLabel>
              <Stack gap={2.5}>

                {/* Nombre */}
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required={!readOnly}
                  InputProps={{
                    readOnly,
                    startAdornment: (
                      <InputAdornment position="start">
                        <StorefrontOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Slug — se actualiza automáticamente con el nombre */}
                <TextField
                  fullWidth
                  label="Slug"
                  name="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  error={!!errors.slug}
                  helperText={
                    errors.slug ||
                    (!isEditing && !slugManuallyEdited
                      ? 'Se genera automáticamente desde el nombre'
                      : 'Solo minúsculas, números y guiones')
                  }
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

                {/* Categoría */}
                <TextField
                  select fullWidth
                  label="Categoría"
                  name="category"
                  value={category ?? ''}
                  onChange={(e) =>
                    dispatch(set_form_store_thunk({ name: 'category', value: e.target.value || null }))
                  }
                  inputProps={{ readOnly }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value=""><em>Sin categoría</em></MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Stack>

              {/* Descripción corta — Quill */}
              <SectionLabel>Descripción corta</SectionLabel>
              <Box sx={readOnly ? quillReadOnlySx(80) : quillSx(100)}>
                <ReactQuill
                  theme="snow"
                  value={short_description ?? ''}
                  onChange={(val) =>
                    dispatch(set_form_store_thunk({ name: 'short_description', value: val }))
                  }
                  modules={readOnly ? { toolbar: false } : QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  readOnly={readOnly}
                  placeholder="Texto breve para tarjetas y listados..."
                />
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                Se muestra en tarjetas de producto y resultados de búsqueda
              </Typography>

              {/* Descripción completa — Quill */}
              <SectionLabel>Descripción completa</SectionLabel>
              <Box sx={readOnly ? quillReadOnlySx(160) : quillSx(200)}>
                <ReactQuill
                  theme="snow"
                  value={description ?? ''}
                  onChange={(val) =>
                    dispatch(set_form_store_thunk({ name: 'description', value: val }))
                  }
                  modules={readOnly ? { toolbar: false } : QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  readOnly={readOnly}
                  placeholder="Descripción detallada del producto..."
                />
              </Box>
            </Box>

            {/* Separador vertical (solo desktop) */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.35 }}
            />

            {/* ═══════════════════════════════════════════════════════
                Columna derecha — Precios / Inventario / Config / SEO
                ═══════════════════════════════════════════════════════ */}
            <Box flex={2} minWidth={0} pb={2}>

              {/* Precios */}
              <SectionLabel first>Precios</SectionLabel>
              <Stack gap={2}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label="Precio base"
                  value={price ?? ''}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  onValueChange={({ value: v }) =>
                    dispatch(set_form_store_thunk({ name: 'price', value: v }))
                  }
                  inputProps={{ readOnly }}
                  helperText="Precio de venta al público"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label="Precio tachado"
                  value={compare_price ?? ''}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  onValueChange={({ value: v }) =>
                    dispatch(set_form_store_thunk({ name: 'compare_price', value: v }))
                  }
                  error={!!errors.compare_price}
                  helperText={errors.compare_price || 'Debe ser mayor al precio base'}
                  inputProps={{ readOnly }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label="Precio de costo"
                  value={cost_price ?? ''}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  onValueChange={({ value: v }) =>
                    dispatch(set_form_store_thunk({ name: 'cost_price', value: v }))
                  }
                  inputProps={{ readOnly }}
                  helperText="Solo visible para admins"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* Inventario */}
              <SectionLabel>Inventario</SectionLabel>
              <Stack gap={2}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={sku}
                  onChange={handleChange}
                  inputProps={{ readOnly, maxLength: 100 }}
                  helperText="Código único del producto (opcional)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QrCodeOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label="Stock"
                  value={stock ?? ''}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  onValueChange={({ value: v }) =>
                    dispatch(set_form_store_thunk({ name: 'stock', value: v }))
                  }
                  inputProps={{ readOnly }}
                  helperText="Unidades disponibles (opcional)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2OutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* Configuración */}
              <SectionLabel>Configuración</SectionLabel>
              <Stack gap={2}>
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

                <FormControlLabel
                  control={
                    <Switch
                      checked={is_featured}
                      onChange={(e) =>
                        dispatch(set_form_store_thunk({ name: 'is_featured', value: e.target.checked }))
                      }
                      disabled={readOnly}
                      color="warning"
                    />
                  }
                  label={<Typography variant="body2">Producto destacado</Typography>}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={is_new}
                      onChange={(e) =>
                        dispatch(set_form_store_thunk({ name: 'is_new', value: e.target.checked }))
                      }
                      disabled={readOnly}
                      color="success"
                    />
                  }
                  label={<Typography variant="body2">Producto nuevo</Typography>}
                />
              </Stack>

              {/* SEO */}
              <SectionLabel>SEO</SectionLabel>
              <Stack gap={2.5}>
                <TextField
                  fullWidth
                  label="Meta título"
                  name="meta_title"
                  value={meta_title}
                  onChange={handleChange}
                  inputProps={{ readOnly, maxLength: 160 }}
                  helperText={`${meta_title?.length ?? 0}/160`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Meta descripción"
                  name="meta_description"
                  value={meta_description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  inputProps={{ readOnly, maxLength: 320 }}
                  helperText={`${meta_description?.length ?? 0}/320`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: '10px', alignSelf: 'flex-start' }}>
                        <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>
          </Stack>

          {/* ── Variantes (solo en modo edición) ── */}
          {isEditing && (
            <>
              <Divider sx={{ mt: 3.5, mb: 2.5, opacity: 0.35 }} />
              <ProductVariantSection
                productId={id}
                readOnly={readOnly}
                token={token}
              />
              <Box pb={2} />
            </>
          )}
        </DialogContent>

        {/* ── Footer ── */}
        <DialogActions
          sx={{
            px: 3.5, py: 2.25, gap: 1.5,
            borderTop:  `1px solid ${alpha(accentColor, 0.15)}`,
            background: `linear-gradient(135deg, ${alpha(accentColor, 0.07)} 0%, ${alpha(accentColor, 0.03)} 100%)`,
            justifyContent: readOnly ? 'center' : 'flex-end',
            flexShrink: 0,
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
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
