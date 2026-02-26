import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Stack, Typography } from '@mui/material';
import DataTable from './DataTable';
import { formatDate } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/attributeStore/attributeThunks';

const columns = [
  {
    field: 'name',
    headerName: 'Atributo',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'primary.main' }}
        >
          {row.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
      </Stack>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Creado',
    width: 160,
    renderCell: (row) => (
      <Typography variant="body2" color="text.secondary">
        {formatDate(row.created_at)}
      </Typography>
    ),
  },
];

export default function AttributesTable({
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
      createLabel="Nuevo atributo"
      emptyTitle="Sin atributos"
      emptyDescription="No hay atributos que coincidan con los filtros aplicados."
    />
  );
}
