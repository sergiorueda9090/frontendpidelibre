import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/customerStore/customerThunks';

const columns = [
  {
    field: 'first_name',
    headerName: 'Cliente',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'primary.main' }}
        >
          {(row.first_name?.charAt(0) || '').toUpperCase()}{(row.last_name?.charAt(0) || '').toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
            {row.first_name} {row.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">{row.email}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'phone',
    headerName: 'Teléfono',
    width: 140,
    sortable: false,
    renderCell: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.phone || '—'}
      </Typography>
    ),
  },
  {
    field: 'document_number',
    headerName: 'Documento',
    width: 140,
    sortable: false,
    renderCell: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.document_number || '—'}
      </Typography>
    ),
  },
  {
    field: 'gender',
    headerName: 'Género',
    width: 120,
    sortable: false,
    renderCell: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.gender?.name || '—'}
      </Typography>
    ),
  },
  {
    field: 'is_active',
    headerName: 'Estado',
    width: 120,
    sortable: true,
    renderCell: (row) => (
      row.is_active
        ? <Chip label={getStatusLabel('Activo')}   color={getStatusColor('active')}    size="small" />
        : <Chip label={getStatusLabel('Inactivo')} color={getStatusColor('inactive')}  size="small" />
    ),
  },
];

export default function CustomerTable({
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
      createLabel="Nuevo cliente"
      emptyTitle="Sin clientes"
      emptyDescription="No hay clientes que coincidan con los filtros aplicados."
    />
  );
}
