import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/featureAreaStore/featureAreaThunks';

const columns = [
  {
    field: 'title',
    headerName: 'Feature',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'action.hover',
            '& svg': { width: 20, height: 20, color: 'primary.main' },
          }}
          dangerouslySetInnerHTML={{ __html: row.icon || '' }}
        />
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">{row.description}</Typography>
        </Box>
      </Stack>
    ),
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

export default function FeatureAreaTable({
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
      createLabel="Nuevo feature"
      emptyTitle="Sin features"
      emptyDescription="No hay features que coincidan con los filtros aplicados."
    />
  );
}
