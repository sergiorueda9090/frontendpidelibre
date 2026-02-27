import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/productsStore/productsThunks';

const columns = [
  {
    field: 'name',
    headerName: 'Producto',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          src={row.image || undefined}
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'primary.main' }}
        >
          {!row.image && row.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.slug}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'category',
    headerName: 'Categoría',
    width: 150,
    renderCell: (row) =>
      row.category
        ? <Chip label={row.category.name} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
        : <Typography variant="caption" color="text.disabled">—</Typography>,
  },
  {
    field: 'price',
    headerName: 'Precio',
    width: 120,
    align: 'right',
    renderCell: (row) => (
      <Stack alignItems="flex-end">
        <Typography variant="body2" fontWeight={600}>
          {row.price !== null ? formatCurrency(row.price) : '—'}
        </Typography>
        {row.compare_price && (
          <Typography variant="caption" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
            {formatCurrency(row.compare_price)}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'stock',
    headerName: 'Stock',
    width: 80,
    align: 'center',
    renderCell: (row) =>
      row.stock !== null
        ? <Chip label={row.stock} size="small" variant="outlined" sx={{ fontWeight: 700, minWidth: 36 }} />
        : <Typography variant="caption" color="text.disabled">—</Typography>,
  },
  {
    field: 'is_active',
    headerName: 'Estado',
    width: 110,
    sortable: true,
    renderCell: (row) => (
      row.is_active
        ? <Chip label={getStatusLabel('Activo')}   color={getStatusColor('active')}   size="small" />
        : <Chip label={getStatusLabel('Inactivo')} color={getStatusColor('inactive')} size="small" />
    ),
  },
  {
    field: 'badges',
    headerName: 'Badges',
    width: 120,
    renderCell: (row) => (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {row.is_featured && <Chip label="Featured" size="small" color="warning" sx={{ fontSize: '0.65rem', height: 20 }} />}
        {row.is_new      && <Chip label="New"      size="small" color="success" sx={{ fontSize: '0.65rem', height: 20 }} />}
      </Stack>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Creado',
    width: 150,
    renderCell: (row) => (
      <Typography variant="body2" color="text.secondary">
        {formatDate(row.created_at)}
      </Typography>
    ),
  },
];

export default function ProductsTable({
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
      createLabel="Nuevo producto"
      emptyTitle="Sin productos"
      emptyDescription="No hay productos que coincidan con los filtros aplicados."
    />
  );
}
