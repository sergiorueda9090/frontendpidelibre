import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Stack, TextField, MenuItem, Typography,
  Button, Chip, InputAdornment, IconButton, Box, Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';

/**
 * FilterPanel — componente de filtros externo a la tabla.
 *
 * Props:
 *   fields      — array de definición de filtros (ver tipos abajo)
 *   onChange    — (values: object) => void  — llamado con los valores actuales
 *   onClear     — () => void                — llamado al limpiar todos los filtros
 *   resultCount — número de resultados (para mostrar badge)
 *
 * Tipos de field:
 *   { key, label, type: 'text',   placeholder?, icon? }
 *   { key, label, type: 'select', options: [{ value, label }] }
 */
export default function FilterPanel({ fields = [], onChange, onClear, resultCount }) {
  const buildEmpty = () =>
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.type === 'select' ? 'all' : '' }), {});

  const [values, setValues] = useState(buildEmpty);
  const [expanded, setExpanded] = useState(true);

  // Contar filtros activos
  const activeCount = Object.entries(values).filter(
    ([, v]) => v && v !== 'all'
  ).length;

  // Debounce para campos de texto
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(values);
    }, 280);
    return () => clearTimeout(timer);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClear = () => {
    const empty = buildEmpty();
    setValues(empty);
    onChange?.(empty);
    onClear?.();
  };

  return (
    <Card
      variant="outlined"
      sx={{ mb: 2.5, borderRadius: 2 }}
    >
      {/* Header del panel */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 1.5, cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded((v) => !v)}
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
          {activeCount > 0 && (
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              sx={{ fontSize: '0.78rem', px: 1, minWidth: 0, textTransform: 'none' }}
            >
              Limpiar
            </Button>
          )}
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
            {expanded ? '▲' : '▼'}
          </Typography>
        </Stack>
      </Stack>

      {/* Campos de filtro */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: `repeat(${Math.min(fields.length, 4)}, 1fr)`,
              },
              gap: 2,
            }}
          >
            {fields.map((field) => {
              if (field.type === 'select') {
                return (
                  <TextField
                    key={field.key}
                    select
                    fullWidth
                    label={field.label}
                    value={values[field.key] ?? 'all'}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    <MenuItem value="all">
                      <em>Todos</em>
                    </MenuItem>
                    {field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }

              // type === 'text'
              return (
                <TextField
                  key={field.key}
                  fullWidth
                  label={field.label}
                  placeholder={field.placeholder ?? `Buscar ${field.label.toLowerCase()}...`}
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {field.icon ?? <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
                      </InputAdornment>
                    ),
                    endAdornment: values[field.key] ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => handleChange(field.key, '')}>
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}
