import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clear_filter_store } from '../../../store/categoryStore/categoryStore';
import { set_filter_store_thunk, get_filter_thunk } from '../../../store/categoryStore/categoryThunks';
import {
  Card, Stack, TextField, MenuItem, Typography,
  Button, Chip, InputAdornment, IconButton,
  Box, Collapse, Divider, alpha, Switch, FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon               from '@mui/icons-material/Search';
import CloseIcon                from '@mui/icons-material/Close';
import TuneIcon                 from '@mui/icons-material/Tune';
import FilterAltOutlinedIcon    from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import ExpandMoreIcon           from '@mui/icons-material/ExpandMore';
import ExpandLessIcon           from '@mui/icons-material/ExpandLess';

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Activa' },
  { value: 'inactive', label: 'Inactiva' },
];

export default function CategoriesFilters({ resultCount }) {
  const dispatch = useDispatch();
  const { filter_search, filter_status, filter_deleted } = useSelector((s) => s.categoryStore);

  const theme   = useTheme();
  const primary = theme.palette.primary.main;

  const [expanded, setExpanded] = useState(true);
  const [isDirty,  setIsDirty]  = useState(false);

  const activeCount = [filter_search, filter_status]
    .filter(v => v && v !== 'all').length + (filter_deleted ? 1 : 0);

  const handleFilterChange = (key, value) => {
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
          px: 2.5, py: 1.5,
          cursor: 'pointer', userSelect: 'none',
          '&:hover': { bgcolor: alpha(primary, 0.03) },
          transition: 'background-color 0.2s',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <TuneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" fontWeight={700}>Filtros</Typography>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} activo${activeCount !== 1 ? 's' : ''}`}
              size="small" color="primary"
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
                label="Buscar categoría"
                placeholder="Nombre o slug..."
                value={filter_search}
                onChange={e => handleFilterChange('filter_search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: filter_search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleFilterChange('filter_search', '')}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>

            {/* Estado */}
            <TextField
              select fullWidth
              name="filter_status"
              label="Estado"
              value={filter_status}
              onChange={e => handleFilterChange('filter_status', e.target.value)}
            >
              <MenuItem value="all"><em>Todos los estados</em></MenuItem>
              {STATUS_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            {/* Eliminadas (soft delete) */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filter_deleted}
                    onChange={e => handleFilterChange('filter_deleted', e.target.checked)}
                    color="error"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color={filter_deleted ? 'error.main' : 'text.secondary'}>
                    Ver eliminadas
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* ─ Acciones ─ */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={1.5}
            sx={{ mt: 2.5, pt: 2, borderTop: `1px dashed ${alpha(primary, 0.2)}` }}
          >
            <Button
              variant="outlined" color="error" size="small"
              startIcon={<FilterAltOffOutlinedIcon />}
              onClick={handleClear}
              disabled={activeCount === 0 && !isDirty}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
            >
              Limpiar
            </Button>

            <Button
              variant="contained" size="small"
              startIcon={<FilterAltOutlinedIcon />}
              onClick={handleApply}
              disableElevation
              sx={{
                borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 2.5,
                bgcolor: primary,
                boxShadow: isDirty ? `0 4px 18px ${alpha(primary, 0.5)}` : 'none',
                '&:hover': { bgcolor: primary, filter: 'brightness(1.1)', boxShadow: `0 6px 22px ${alpha(primary, 0.55)}` },
                transition: 'box-shadow 0.3s ease',
                position: 'relative',
              }}
            >
              Aplicar filtros
              {isDirty && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute', top: -4, right: -4,
                    width: 10, height: 10, borderRadius: '50%',
                    bgcolor: 'warning.main',
                    border: '2px solid', borderColor: 'background.paper',
                  }}
                />
              )}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}
