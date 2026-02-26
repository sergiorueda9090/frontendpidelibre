import React, { useState, useMemo, useCallback } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Button, IconButton,
  Stack, Tooltip, Typography, Fade, Box,
  alpha, useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import TableSkeleton from './loaders/TableSkeleton';
import EmptyState from './EmptyState';

/* ─── Helpers de ordenamiento ─────────────────────────────────── */
function descendingComparator(a, b, orderBy) {
  const av = a[orderBy] ?? '';
  const bv = b[orderBy] ?? '';
  if (bv < av) return -1;
  if (bv > av) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * DataTable — tabla con ordenamiento y acciones CRUD.
 * La paginación es externa: recibe page y rowsPerPage como props.
 *
 * Props:
 *   columns          — definición de columnas
 *   rows             — registros de la página actual (paginación del servidor)
 *   loading          — muestra skeleton mientras carga
 *   page             — página actual (0-indexed)
 *   rowsPerPage      — filas visibles por página
 *   onView           — (row) => void
 *   onEdit           — (row) => void
 *   onToggle         — (row) => void
 *   isActive         — (row) => bool
 *   onDelete         — (row) => void
 *   onCreate         — () => void
 *   createLabel      — texto del botón crear
 *   emptyTitle       — título del estado vacío
 *   emptyDescription — descripción del estado vacío
 */
export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onView,
  onEdit,
  onDelete,
  onToggle,
  isActive,
  onCreate,
  createLabel = 'Crear',
  emptyTitle = 'Sin resultados',
  emptyDescription = 'No se encontraron elementos que coincidan.',
}) {
  const theme = useTheme();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const hasActions = Boolean(onView || onEdit || onDelete || onToggle);
  const isDark = theme.palette.mode === 'dark';

  const handleSort = useCallback((field) => {
    if (orderBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  }, [orderBy]);

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort(getComparator(order, orderBy));
  }, [rows, order, orderBy]);

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return <TableSkeleton columns={columns.length + (hasActions ? 1 : 0)} />;
  }

  const headerBg = isDark
    ? alpha(theme.palette.primary.main, 0.15)
    : alpha(theme.palette.primary.main, 0.06);
  const headerColor = theme.palette.primary.main;

  return (
    <Fade in timeout={350}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? '0 1px 12px rgba(0,0,0,0.35)'
            : '0 1px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Barra superior */}
        {onCreate && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2.5,
              py: 1.75,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : 'background.paper',
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
              }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {rows.length} registro{rows.length !== 1 ? 's' : ''}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreate}
              disableElevation
              size="small"
              sx={{
                borderRadius: '10px', fontWeight: 700, px: 2, py: 0.75,
                textTransform: 'none', letterSpacing: 0.3,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`,
                '&:hover': {
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.45)}`,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.18s ease',
              }}
            >
              {createLabel}
            </Button>
          </Stack>
        )}

        <TableContainer>
          <Table size="small">
            {/* ── Header ── */}
            <TableHead>
              <TableRow sx={{ bgcolor: headerBg }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    align={col.align || 'left'}
                    style={{ width: col.width }}
                    sx={{
                      py: 1.5, fontWeight: 700, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: headerColor,
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.field}
                        direction={orderBy === col.field ? order : 'asc'}
                        onClick={() => handleSort(col.field)}
                        sx={{
                          color: `${headerColor} !important`,
                          '& .MuiTableSortLabel-icon': { color: `${headerColor} !important` },
                        }}
                      >
                        {col.headerName}
                      </TableSortLabel>
                    ) : col.headerName}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell align="right" sx={{
                    py: 1.5, fontWeight: 700, fontSize: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: headerColor,
                    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    width: 'auto', whiteSpace: 'nowrap',
                  }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            {/* ── Body ── */}
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} sx={{ border: 0, p: 0 }}>
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, rIdx) => (
                  <TableRow
                    key={row.id ?? rIdx}
                    sx={{
                      cursor: 'default',
                      transition: 'background-color 0.15s ease',
                      '&:nth-of-type(even)': {
                        bgcolor: isDark
                          ? alpha(theme.palette.action.hover, 0.03)
                          : alpha(theme.palette.primary.main, 0.015),
                      },
                      '&:hover': {
                        bgcolor: isDark
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.045),
                      },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        align={col.align || 'left'}
                        style={{ width: col.width }}
                        sx={{ py: 1.25, fontSize: '0.8125rem', color: 'text.primary', borderColor: theme.palette.divider }}
                      >
                        {col.renderCell ? col.renderCell(row) : String(row[col.field] ?? '')}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell align="right" sx={{ py: 0.75, borderColor: theme.palette.divider }}>
                        <Stack direction="row" justifyContent="flex-end" gap={0.5}>
                          {onView && (
                            <Tooltip title="Ver detalle" arrow>
                              <IconButton size="small" onClick={() => onView(row)} sx={{
                                color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.07),
                                borderRadius: '8px', width: 32, height: 32, transition: 'all 0.18s ease',
                                '&:hover': { bgcolor: theme.palette.info.main, color: '#fff', transform: 'scale(1.08)', boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.4)}` },
                              }}>
                                <VisibilityIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onEdit && (
                            <Tooltip title="Editar" arrow>
                              <IconButton size="small" onClick={() => onEdit(row)} sx={{
                                color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.07),
                                borderRadius: '8px', width: 32, height: 32, transition: 'all 0.18s ease',
                                '&:hover': { bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, transform: 'scale(1.08)', boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}` },
                              }}>
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onToggle && (() => {
                            const active = isActive ? isActive(row) : Boolean(row.is_active ?? row.isActive ?? row.active);
                            const toggleColor = active ? theme.palette.success.main : theme.palette.warning.main;
                            return (
                              <Tooltip title={active ? 'Desactivar' : 'Activar'} arrow>
                                <IconButton size="small" onClick={() => onToggle(row)} sx={{
                                  color: toggleColor, bgcolor: alpha(toggleColor, 0.07),
                                  borderRadius: '8px', width: 32, height: 32, transition: 'all 0.18s ease',
                                  '&:hover': { bgcolor: toggleColor, color: '#fff', transform: 'scale(1.08)', boxShadow: `0 2px 8px ${alpha(toggleColor, 0.4)}` },
                                }}>
                                  {active ? <ToggleOnIcon sx={{ fontSize: 20 }} /> : <ToggleOffIcon sx={{ fontSize: 20 }} />}
                                </IconButton>
                              </Tooltip>
                            );
                          })()}
                          {onDelete && (
                            <Tooltip title="Eliminar" arrow>
                              <IconButton size="small" onClick={() => onDelete(row)} sx={{
                                color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.07),
                                borderRadius: '8px', width: 32, height: 32, transition: 'all 0.18s ease',
                                '&:hover': { bgcolor: theme.palette.error.main, color: '#fff', transform: 'scale(1.08)', boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}` },
                              }}>
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fade>
  );
}
