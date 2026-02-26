import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem, CircularProgress,
  Box, Typography, Divider, Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const CATEGORIES = ['Electrónica', 'Accesorios', 'Audio', 'Mobiliario', 'Almacenamiento', 'Oficina', 'Redes', 'Fotografía'];
const STATUS_OPTIONS = [{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }];

const EMPTY = { name: '', description: '', category: '', price: '', stock: '', sku: '', status: 'active' };

export default function ProductModal({ open, onClose, onSave, product, saving }) {
  const isEditing = Boolean(product?.id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(product ? { ...product, price: String(product.price), stock: String(product.stock) } : EMPTY);
    setErrors({});
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.category) errs.category = 'La categoría es requerida';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Precio inválido';
    if (!form.sku.trim()) errs.sku = 'El SKU es requerido';
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = 'Stock inválido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 1, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</Typography>
            <Typography variant="caption" color="text.secondary">{isEditing ? 'Modifica los datos del producto' : 'Completa los campos para agregar un producto'}</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={saving} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ py: 2.5 }}>
        {saving && (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
            <CircularProgress />
          </Box>
        )}
        <Stack gap={2.5}>
          <TextField fullWidth label="Nombre del producto" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
          <TextField fullWidth label="Descripción" name="description" value={form.description} onChange={handleChange} multiline rows={2} />
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField fullWidth select label="Categoría" name="category" value={form.category} onChange={handleChange} error={!!errors.category} helperText={errors.category} required>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="Estado" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField fullWidth label="Precio (MXN)" name="price" type="number" value={form.price} onChange={handleChange} error={!!errors.price} helperText={errors.price} required inputProps={{ min: 0, step: '0.01' }} />
            <TextField fullWidth label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} error={!!errors.stock} helperText={errors.stock} required inputProps={{ min: 0 }} />
          </Stack>
          <TextField fullWidth label="SKU" name="sku" value={form.sku} onChange={handleChange} error={!!errors.sku} helperText={errors.sku} required />
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null} disableElevation>
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
