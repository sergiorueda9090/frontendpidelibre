import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_form_store_thunk } from '../../../store/featureAreaStore/featureAreaThunks';
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
import DescriptionOutlinedIcon        from '@mui/icons-material/DescriptionOutlined';
import CodeOutlinedIcon               from '@mui/icons-material/CodeOutlined';
import SortOutlinedIcon               from '@mui/icons-material/SortOutlined';
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

export default function FeatureAreaModal({ open, onClose, onSave, feature, saving, readOnly = false }) {
  const theme    = useTheme();
  const dispatch = useDispatch();

  const { id, icon, title, description, order, is_active } = useSelector((s) => s.featureAreaStore);

  const isEditing = Boolean(feature?.id);
  const [errors, setErrors] = useState({});

  useEffect(() => { setErrors({}); }, [open]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    dispatch(set_form_store_thunk({ name: field, value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'El título es requerido';
    if (!icon.trim())  errs.icon  = 'El ícono SVG es requerido';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ id: feature?.id, icon, title, description, order, is_active });
  };

  const accentColor = readOnly ? theme.palette.info.main : theme.palette.primary.main;
  const ModeIcon    = readOnly ? VisibilityOutlinedIcon : isEditing ? EditOutlinedIcon : AddCircleOutlineIcon;
  const modalTitle  = readOnly ? 'Detalle del feature' : isEditing ? 'Editar feature' : 'Nuevo feature';
  const modalSubtitle = readOnly
    ? `Información de ${feature?.title ?? ''}`
    : isEditing
      ? `Modifica los datos de ${feature?.title ?? ''}`
      : 'Completa el formulario para registrar un nuevo feature';

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

          {/* Ícono SVG */}
          <SectionLabel>Ícono SVG</SectionLabel>
          <Stack gap={2.5}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              label="Código SVG"
              name="icon"
              value={icon}
              onChange={handleChange}
              error={!!errors.icon}
              helperText={errors.icon || 'Pega el código SVG del ícono'}
              required={!readOnly}
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <CodeOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Vista previa del SVG */}
            {icon && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 64, height: 64, borderRadius: 2,
                    border: `2px solid ${alpha(accentColor, 0.2)}`,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '& svg': { width: 32, height: 32, color: accentColor },
                  }}
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
              </Box>
            )}
          </Stack>

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
              label="Descripción"
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Ej: Orders from all item"
              InputProps={{
                readOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Configuración */}
          <SectionLabel>Configuración</SectionLabel>
          <Stack gap={2.5} pb={2}>
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
                {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear feature'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
