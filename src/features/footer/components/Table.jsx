import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/footerStore/footerThunks';

const columns = [
  {
    field: 'description',
    headerName: 'Footer',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          src={row.logo || undefined}
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'primary.main' }}
        >
          {!row.logo && 'F'}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
            {row.description ? (row.description.length > 40 ? row.description.substring(0, 40) + '...' : row.description) : 'Sin descripción'}
          </Typography>
          <Typography variant="caption" color="text.secondary">{row.email}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'phone',
    headerName: 'Teléfono',
    width: 150,
    renderCell: (row) =>
      row.phone
        ? <Typography variant="body2">{row.phone}</Typography>
        : <Typography variant="caption" color="text.disabled">—</Typography>,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 180,
    renderCell: (row) =>
      row.email
        ? <Typography variant="body2">{row.email}</Typography>
        : <Typography variant="caption" color="text.disabled">—</Typography>,
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

export default function FooterTable({
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
      createLabel="Nuevo footer"
      emptyTitle="Sin footers"
      emptyDescription="No hay footers que coincidan con los filtros aplicados."
    />
  );
}
