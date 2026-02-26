import React, { useMemo } from 'react';
import {
  Box, Stack, Typography, IconButton, Tooltip, Select, MenuItem, Paper, alpha, useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

/**
 * Pagination — paginación moderna centrada con botones numerados.
 *
 * Props:
 *   count                — total de registros
 *   page                 — página actual (0-indexed)
 *   rowsPerPage          — filas por página
 *   onPageChange         — (page: number) => void
 *   rowsPerPageOptions   — opciones del selector (default [5,10,25])
 *   onRowsPerPageChange  — (rows: number) => void
 */
export default function Pagination({
  count = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  rowsPerPageOptions = [5, 10, 25],
  onRowsPerPageChange,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const totalPages = Math.ceil(count / rowsPerPage);
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const pages = [];
    if (page <= 3) {
      pages.push(0, 1, 2, 3, 4, '…', totalPages - 1);
    } else if (page >= totalPages - 4) {
      pages.push(0, '…', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pages.push(0, '…', page - 1, page, page + 1, '…', totalPages - 1);
    }
    return pages;
  }, [page, totalPages]);

  const btnBase = {
    minWidth: 36,
    height: 36,
    px: 0,
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.8125rem',
    transition: 'all 0.18s ease',
    border: '1.5px solid transparent',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.35)' : '0 1px 12px rgba(0,0,0,0.06)',
        mt: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          px: 2.5,
          py: 1.75,
        }}
      >
        {/* Filas por página */}
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Filas por página:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              height: 32,
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
            }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Botones de página */}
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Tooltip title="Primera página">
            <span>
              <IconButton size="small" onClick={() => onPageChange?.(0)} disabled={page === 0}
                sx={{ ...btnBase, color: page === 0 ? 'text.disabled' : 'text.secondary',
                  '&:hover:not(:disabled)': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <FirstPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Página anterior">
            <span>
              <IconButton size="small" onClick={() => onPageChange?.(page - 1)} disabled={page === 0}
                sx={{ ...btnBase, color: page === 0 ? 'text.disabled' : 'text.secondary',
                  '&:hover:not(:disabled)': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {pageNumbers.map((p, idx) =>
            p === '…' ? (
              <Typography key={`e-${idx}`} variant="caption"
                sx={{ px: 0.5, color: 'text.disabled', lineHeight: '36px', userSelect: 'none' }}>
                ···
              </Typography>
            ) : (
              <IconButton key={p} size="small" onClick={() => onPageChange?.(p)}
                sx={{ ...btnBase,
                  bgcolor: p === page ? theme.palette.primary.main : 'transparent',
                  color: p === page ? theme.palette.primary.contrastText : 'text.secondary',
                  borderColor: p === page ? theme.palette.primary.main : 'transparent',
                  boxShadow: p === page ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
                  '&:hover': p === page ? {} : { bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) },
                }}>
                {p + 1}
              </IconButton>
            )
          )}

          <Tooltip title="Página siguiente">
            <span>
              <IconButton size="small" onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages - 1}
                sx={{ ...btnBase, color: page >= totalPages - 1 ? 'text.disabled' : 'text.secondary',
                  '&:hover:not(:disabled)': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Última página">
            <span>
              <IconButton size="small" onClick={() => onPageChange?.(totalPages - 1)} disabled={page >= totalPages - 1}
                sx={{ ...btnBase, color: page >= totalPages - 1 ? 'text.disabled' : 'text.secondary',
                  '&:hover:not(:disabled)': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <LastPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {/* Conteo */}
        <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ minWidth: 90, textAlign: 'right' }}>
          {count === 0 ? '0' : `${from}–${to}`}{' '}
          <Typography component="span" variant="caption" color="text.disabled">de {count}</Typography>
        </Typography>
      </Box>
    </Paper>
  );
}
