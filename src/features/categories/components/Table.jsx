import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/categoryStore/categoryThunks';

const columns = [
  {
    field: 'name',
    headerName: 'Categoría',
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
    field: 'parent',
    headerName: 'Categoría Padre',
    width: 160,
    renderCell: (row) =>
      row.parent
        ? <Typography variant="body2">{row.parent.name}</Typography>
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

export default function CategoriesTable({
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
      createLabel="Nueva categoría"
      emptyTitle="Sin categorías"
      emptyDescription="No hay categorías que coincidan con los filtros aplicados."
    />
  );
}
