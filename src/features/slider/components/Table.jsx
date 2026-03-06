import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/sliderStore/sliderThunks';

const columns = [
  {
    field: 'title',
    headerName: 'Slider',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          src={row.image || undefined}
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: row.bg_color || 'primary.main' }}
        >
          {!row.image && row.title?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">{row.subtitle}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'product',
    headerName: 'Producto',
    width: 160,
    renderCell: (row) =>
      row.product
        ? <Typography variant="body2">{row.product.name}</Typography>
        : <Typography variant="caption" color="text.disabled">—</Typography>,
  },
  {
    field: 'discount_percentage',
    headerName: 'Descuento',
    width: 110,
    align: 'center',
    renderCell: (row) =>
      row.discount_percentage != null
        ? <Chip label={`-${row.discount_percentage}%`} size="small" color="warning" variant="outlined" sx={{ fontWeight: 700, minWidth: 50 }} />
        : <Typography variant="caption" color="text.disabled">—</Typography>,
  },
  {
    field: 'order',
    headerName: 'Orden',
    width: 80,
    align: 'center',
    renderCell: (row) => (
      <Chip label={row.order} size="small" variant="outlined" sx={{ fontWeight: 700, minWidth: 36 }} />
    ),
  },
  {
    field: 'is_active',
    headerName: 'Estado',
    width: 120,
    sortable: true,
    renderCell: (row) => (
      row.is_active
        ? <Chip label={getStatusLabel('Activa')}   color={getStatusColor('active')}    size="small" />
        : <Chip label={getStatusLabel('Inactiva')} color={getStatusColor('inactive')}  size="small" />
    ),
  },
];

export default function SliderTable({
  rows, loading, page, rowsPerPage,
  onView, onEdit, onDelete, onCreate,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_all_thunk());
  }, [dispatch]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      loading={loading}
      page={page}
      rowsPerPage={rowsPerPage}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onCreate={onCreate}
      isActive={(row) => row.is_active}
      createLabel="Nuevo slider"
      emptyTitle="Sin sliders"
      emptyDescription="No hay sliders que coincidan con los filtros aplicados."
    />
  );
}
