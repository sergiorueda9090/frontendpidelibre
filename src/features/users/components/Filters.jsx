import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clear_filter_store } from '../../../store/userStore/userStore';
import { set_filter_store_thunk, get_filter_thunk } from '../../../store/userStore/userThunks';
import {
  Card, Stack, TextField, MenuItem, Typography,
  Button, Chip, InputAdornment, IconButton,
  Box, Collapse, Divider, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon                from '@mui/icons-material/Search';
import CloseIcon                 from '@mui/icons-material/Close';
import TuneIcon                  from '@mui/icons-material/Tune';
import FilterAltOutlinedIcon     from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon  from '@mui/icons-material/FilterAltOffOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ExpandMoreIcon            from '@mui/icons-material/ExpandMore';
import ExpandLessIcon            from '@mui/icons-material/ExpandLess';

const ROLES = [
  { value: 'admin',    label: 'Administrador' },
  { value: 'editor',   label: 'Editor' },
  { value: 'customer', label: 'Cliente' },
];

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'blocked',  label: 'Bloqueado' },
];

/* ─────────────────────────────────────────────────────────────── */
export default function UsersFilters({ resultCount }) {
  const dispatch = useDispatch();
  const { filter_roles, filter_status,
         filter_start_date, filter_end_date, filter_search } = useSelector((s) => s.userStore);

  const theme   = useTheme();
  const primary = theme.palette.primary.main;

  const [expanded, setExpanded] = useState(true);
  // isDirty: el usuario cambió algo pero aún no pulsó "Aplicar"
  const [isDirty, setIsDirty] = useState(false);

  // Cuenta filtros con valor real (distinto de vacío o 'all')
  const activeCount = [filter_search, filter_roles, filter_status, filter_start_date, filter_end_date]
    .filter(v => v && v !== 'all').length;

  const hanldeFilterChange = (key, value) => {
    dispatch(set_filter_store_thunk({ key, value }));
    setIsDirty(true);
  };

  const handleApply = () => {
    dispatch(get_filter_thunk());
    setIsDirty(false);
  };

  const handleClear = () => {
    dispatch(clear_filter_store());
    dispatch(get_filter_thunk()); 
    setIsDirty(false);
  };

  /* ── Render ── */
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2.5,
        borderRadius: 2,
        borderColor: isDirty ? alpha(primary, 0.35) : 'divider',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* ── Header colapsable ─────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: alpha(primary, 0.03) },
          transition: 'background-color 0.2s',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <TuneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" fontWeight={700}>
            Filtros
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} activo${activeCount !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" gap={1.5}>
          {resultCount !== undefined && (
            <Typography variant="caption" color="text.disabled">
              {resultCount} resultado{resultCount !== 1 ? 's' : ''}
            </Typography>
          )}
          {expanded
            ? <ExpandLessIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            : <ExpandMoreIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
        </Stack>
      </Stack>

      {/* ── Cuerpo colapsable ─────────────────────────────────── */}
      <Collapse in={expanded}>
        <Divider />

        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>

          {/* ─ Búsqueda y categorías ─ */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {/* Búsqueda — ocupa 2 columnas en md */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / 3' } }}>
              <TextField
                fullWidth
                name="filter_search"
                label="Buscar usuario"
                placeholder="Nombre, correo electrónico o usuario..."
                value={filter_search}
                onChange={e => hanldeFilterChange('filter_search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: filter_search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => hanldeFilterChange('filter_search', '')}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>

            {/* Rol */}
            <TextField
              select fullWidth
              name="filter_roles"
              label="Rol"
              value={filter_roles}
              onChange={e => hanldeFilterChange('filter_roles', e.target.value)}
            >
              <MenuItem value="all"><em>Todos los roles</em></MenuItem>
              {ROLES.map(r => (
                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
              ))}
            </TextField>

            {/* Estado */}
            <TextField
              select fullWidth
              name="filter_status"
              label="Estado"
              value={filter_status}
              onChange={e => hanldeFilterChange('filter_status', e.target.value)}
            >
              <MenuItem value="all"><em>Todos los estados</em></MenuItem>
              {STATUS_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ─ Rango de fechas ─ */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="overline"
              fontWeight={700}
              sx={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'text.disabled', display: 'block', mb: 1.5 }}
            >
              Rango de registro
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                name="filter_start_date"
                label="Desde"
                type="date"
                value={filter_start_date}
                onChange={e => hanldeFilterChange('filter_start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: filter_start_date ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => hanldeFilterChange('filter_start_date', '')}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <TextField
                fullWidth
                name="filter_end_date"
                label="Hasta"
                type="date"
                value={filter_end_date}
                onChange={e => hanldeFilterChange('filter_end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: filter_start_date || undefined }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: filter_end_date ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => hanldeFilterChange('filter_end_date', '')}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>
          </Box>

          {/* ─ Acciones ─ */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2.5, pt: 2, borderTop: `1px dashed ${alpha(primary, 0.2)}` }}
          >
            {/* Info del rango activo (solo cuando ya fue aplicado) */}
            <Box>
              {(filter_start_date || filter_end_date) && !isDirty && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">
                    <strong>{filter_start_date || '—'}</strong>
                    {' → '}
                    <strong>{filter_end_date || 'hoy'}</strong>
                  </Typography>
                </Stack>
              )}
            </Box>

            <Stack direction="row" gap={1.5}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<FilterAltOffOutlinedIcon />}
                onClick={handleClear}
                disabled={activeCount === 0 && !isDirty}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
              >
                Limpiar
              </Button>

              <Button
                variant="contained"
                size="small"
                startIcon={<FilterAltOutlinedIcon />}
                onClick={handleApply}
                disableElevation
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  bgcolor: primary,
                  position: 'relative',
                  boxShadow: isDirty ? `0 4px 18px ${alpha(primary, 0.5)}` : 'none',
                  '&:hover': { bgcolor: primary, filter: 'brightness(1.1)', boxShadow: `0 6px 22px ${alpha(primary, 0.55)}` },
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                Aplicar filtros
                {isDirty && (
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: -4, right: -4,
                      width: 10, height: 10,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }}
                  />
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}
