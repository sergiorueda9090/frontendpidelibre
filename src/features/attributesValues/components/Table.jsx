import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { formatDate } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/attributeValuesStore/attributeValuesThunks';

const columns = [
  {
    field: 'attribute',
    headerName: 'Atributo',
    width: 160,
    sortable: true,
    renderCell: (row) => (
      <Chip
        label={row.attribute?.name ?? '—'}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
      />
    ),
  },
  {
    field: 'value',
    headerName: 'Valor',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1}>
        {row.color_hex && (
          <Box
            sx={{
              width: 18, height: 18, borderRadius: '4px',
              bgcolor: row.color_hex,
              border: '1px solid rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          />
        )}
        <Typography variant="body2" fontWeight={600}>{row.value}</Typography>
        {row.color_hex && (
          <Typography variant="caption" color="text.disabled">{row.color_hex}</Typography>
        )}
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

export default function AttributesValuesTable({
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
      createLabel="Nuevo valor"
      emptyTitle="Sin valores de atributo"
      emptyDescription="No hay valores que coincidan con los filtros aplicados."
    />
  );
}
