import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { get_all_thunk } from '../../../store/genderStore/genderThunks';

const columns = [
  {
    field: 'name',
    headerName: 'Género',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.slug}</Typography>
        </Box>
      </Stack>
    ),
  },
];

export default function GenderTable({
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
      createLabel="Nuevo género"
      emptyTitle="Sin géneros"
      emptyDescription="No hay géneros que coincidan con los filtros aplicados."
    />
  );
}
