import React, { useState, useEffect, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  Box, Stack, Typography, TextField, Chip, IconButton, Button,
  Switch, FormControlLabel, CircularProgress, alpha, Autocomplete,
  Collapse,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon                from '@mui/icons-material/Add';
import EditOutlinedIcon       from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon      from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon       from '@mui/icons-material/SaveOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import QrCodeOutlinedIcon      from '@mui/icons-material/QrCodeOutlined';
import Inventory2OutlinedIcon  from '@mui/icons-material/Inventory2Outlined';
import api from '../../../services/axiosInstance';
import { alertError, alertDeleted, confirmDelete } from '../../../utils/alerts';

const EMPTY_FORM = {
  sku: '', price: '', compare_price: '', stock: '',
  is_active: true, attribute_values: [],
};

const fmtNum = (v) =>
  v != null && v !== ''
    ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(v)
    : '—';

/* ── Componente ──────────────────────────────────────────────────────────── */
export default function ProductVariantSection({ productId, readOnly, token }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = theme.palette.primary.main;

  const [variants,   setVariants]   = useState([]);
  const [attrValues, setAttrValues] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});

  const headers = { Authorization: `Bearer ${token}` };

  /* ── Carga de datos ── */
  const loadVariants = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await api.get(`api/product/${productId}/variants/`, { headers });
      setVariants(res.data);
    } catch {
      alertError('Error', 'No se pudieron cargar las variantes.');
    } finally {
      setLoading(false);
    }
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAttrValues = useCallback(async () => {
    try {
      const res = await api.get('api/attribute-value/all/', {
        headers,
        params: { page_size: 500, page: 1 },
      });
      setAttrValues(res.data.results || []);
    } catch {
      // silent — el selector sigue siendo usable aunque esté vacío
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadVariants();
    loadAttrValues();
  }, [loadVariants, loadAttrValues]);

  /* ── Helpers de formulario ── */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (variant) => {
    setForm({
      sku:              variant.sku,
      price:            String(variant.price),
      compare_price:    variant.compare_price != null ? String(variant.compare_price) : '',
      stock:            String(variant.stock),
      is_active:        variant.is_active,
      attribute_values: variant.attribute_values || [],
    });
    setErrors({});
    setEditingId(variant.id);
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.sku?.trim()) errs.sku   = 'SKU requerido';
    if (!form.price)       errs.price = 'Precio requerido';
    if (form.compare_price && Number(form.compare_price) <= Number(form.price)) {
      errs.compare_price = 'Debe ser mayor al precio';
    }
    return errs;
  };

  /* ── Guardar variante ── */
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        sku:              form.sku.trim(),
        price:            form.price,
        is_active:        form.is_active,
        stock:            form.stock || '0',
        attribute_values: form.attribute_values.map((av) => av.id),
      };
      if (form.compare_price) payload.compare_price = form.compare_price;

      if (editingId) {
        await api.put(`api/product/variants/${editingId}/update/`, payload, { headers });
      } else {
        await api.post(`api/product/${productId}/variants/create/`, payload, { headers });
      }
      await loadVariants();
      resetForm();
    } catch (e) {
      const apiErrors = e.response?.data?.errors;
      const msg = apiErrors
        ? Object.values(apiErrors).flat().join(' ')
        : e.response?.data?.detail || 'Error al guardar la variante.';
      alertError('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Eliminar variante ── */
  const handleDelete = async (variant) => {
    const ok = await confirmDelete(variant.sku);
    if (!ok) return;
    try {
      await api.delete(`api/product/variants/${variant.id}/delete/`, { headers });
      alertDeleted('Variante');
      setVariants((prev) => prev.filter((v) => v.id !== variant.id));
    } catch {
      alertError('Error', 'No se pudo eliminar la variante.');
    }
  };

  /* ── Render ── */
  return (
    <Box>
      {/* Header de sección */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography
            variant="overline" fontWeight={700} color="text.disabled"
            sx={{ letterSpacing: '0.1em', fontSize: '0.7rem' }}
          >
            Variantes del producto
          </Typography>
          {variants.length > 0 && (
            <Chip label={variants.length} size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
            />
          )}
        </Stack>
        {!readOnly && !showForm && (
          <Button
            size="small" startIcon={<AddIcon />} onClick={openAdd}
            variant="outlined"
            sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}
          >
            Nueva variante
          </Button>
        )}
      </Stack>

      {/* Cargando */}
      {loading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Estado vacío */}
      {!loading && variants.length === 0 && !showForm && (
        <Box
          sx={{
            border: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
            borderRadius: 2, py: 3, textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.disabled">
            Este producto no tiene variantes.
            {!readOnly && ' Haz clic en "Nueva variante" para agregar una.'}
          </Typography>
        </Box>
      )}

      {/* Lista de variantes */}
      {!loading && variants.length > 0 && (
        <Stack gap={1}>
          {variants.map((v) => (
            <Box
              key={v.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2, py: 1.25, borderRadius: 2,
                border: `1px solid ${alpha(
                  editingId === v.id ? accent : theme.palette.divider,
                  editingId === v.id ? 0.5 : 0.5
                )}`,
                bgcolor: editingId === v.id
                  ? alpha(accent, 0.06)
                  : isDark ? alpha('#fff', 0.02) : alpha(theme.palette.action.hover, 0.4),
              }}
            >
              {/* Info de la variante */}
              <Box flex={1} minWidth={0}>
                {/* Atributos en chips */}
                <Stack direction="row" gap={0.5} flexWrap="wrap" mb={0.5}>
                  {v.attribute_values.length > 0
                    ? v.attribute_values.map((av) => (
                        <Chip
                          key={av.id}
                          label={`${av.attribute.name}: ${av.value}`}
                          size="small"
                          sx={{
                            height: 20, fontSize: '0.68rem', fontWeight: 600,
                            bgcolor: av.color_hex
                              ? alpha(av.color_hex, 0.18)
                              : alpha(accent, 0.1),
                            color:   av.color_hex ? av.color_hex : accent,
                          }}
                        />
                      ))
                    : (
                        <Typography variant="caption" color="text.disabled" fontStyle="italic">
                          Sin atributos
                        </Typography>
                      )
                  }
                </Stack>
                {/* SKU, precios, stock, estado */}
                <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
                  <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                    {v.sku}
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    $ {fmtNum(v.price)}
                  </Typography>
                  {v.compare_price && (
                    <Typography variant="caption" color="text.disabled"
                      sx={{ textDecoration: 'line-through' }}>
                      $ {fmtNum(v.compare_price)}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Stock: {fmtNum(v.stock)}
                  </Typography>
                  <Chip
                    label={v.is_active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={v.is_active ? 'success' : 'default'}
                    sx={{ height: 18, fontSize: '0.65rem' }}
                  />
                </Stack>
              </Box>

              {/* Acciones */}
              {!readOnly && (
                <Stack direction="row" gap={0.25} flexShrink={0}>
                  <IconButton
                    size="small" onClick={() => openEdit(v)}
                    sx={{ color: 'text.secondary', '&:hover': { color: accent } }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                  <IconButton
                    size="small" onClick={() => handleDelete(v)}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      )}

      {/* Formulario inline para agregar/editar */}
      <Collapse in={showForm} unmountOnExit>
        <Box
          sx={{
            mt: 2, p: 2.5, borderRadius: 2,
            border: `1px solid ${alpha(accent, 0.3)}`,
            bgcolor: alpha(accent, 0.04),
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.primary">
            {editingId ? 'Editar variante' : 'Nueva variante'}
          </Typography>

          <Stack gap={2}>
            {/* Selector de valores de atributo */}
            <Autocomplete
              multiple
              options={attrValues}
              groupBy={(opt) => opt.attribute?.name ?? ''}
              getOptionLabel={(opt) => opt.value}
              value={form.attribute_values}
              onChange={(_, newVal) => setForm((p) => ({ ...p, attribute_values: newVal }))}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((opt, index) => (
                  <Chip
                    key={opt.id}
                    label={opt.value}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: opt.color_hex ? alpha(opt.color_hex, 0.18) : undefined,
                      color:   opt.color_hex ? opt.color_hex : undefined,
                      fontWeight: 600,
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Valores de atributo"
                  placeholder="Ej. Rojo, Talla M..."
                  size="small"
                />
              )}
            />

            {/* SKU + is_active */}
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
              <TextField
                fullWidth size="small"
                label="SKU *"
                value={form.sku}
                onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                error={!!errors.sku}
                helperText={errors.sku}
                InputProps={{
                  startAdornment: (
                    <QrCodeOutlinedIcon sx={{ mr: 0.75, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={form.is_active}
                    onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                    color="success"
                  />
                }
                label={<Typography variant="body2">Activo</Typography>}
                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              />
            </Stack>

            {/* Precio + Precio tachado + Stock */}
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
              <NumericFormat
                customInput={TextField}
                fullWidth size="small"
                label="Precio *"
                value={form.price}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                onValueChange={({ value: v }) => setForm((p) => ({ ...p, price: v }))}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <AttachMoneyOutlinedIcon sx={{ mr: 0.75, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
              <NumericFormat
                customInput={TextField}
                fullWidth size="small"
                label="Precio tachado"
                value={form.compare_price}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                onValueChange={({ value: v }) => setForm((p) => ({ ...p, compare_price: v }))}
                error={!!errors.compare_price}
                helperText={errors.compare_price}
                InputProps={{
                  startAdornment: (
                    <AttachMoneyOutlinedIcon sx={{ mr: 0.75, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
              <NumericFormat
                customInput={TextField}
                fullWidth size="small"
                label="Stock"
                value={form.stock}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
                onValueChange={({ value: v }) => setForm((p) => ({ ...p, stock: v }))}
                InputProps={{
                  startAdornment: (
                    <Inventory2OutlinedIcon sx={{ mr: 0.75, fontSize: 18, color: 'text.disabled' }} />
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Botones del formulario */}
          <Stack direction="row" justifyContent="flex-end" gap={1.5} mt={2.5}>
            <Button
              size="small" onClick={resetForm} disabled={saving}
              variant="outlined"
              sx={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              size="small" onClick={handleSave} disabled={saving}
              variant="contained" disableElevation
              startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveOutlinedIcon />}
              sx={{
                borderRadius: '8px', fontWeight: 700,
                bgcolor: accent,
                '&:hover': { bgcolor: accent, filter: 'brightness(1.1)' },
              }}
            >
              {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar variante'}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
