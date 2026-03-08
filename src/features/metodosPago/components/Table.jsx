import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel } from '../../../utils/formatters';
import { get_all_thunk } from '../../../store/metodospagosStore/metodosThunks';

const PROVIDER_LABELS = {
  mercadopago: 'Mercado Pago',
  wompi:       'Wompi',
  paypal:      'PayPal',
  stripe:      'Stripe',
  other:       'Otro',
};

const ENV_COLORS = {
  sandbox:    'warning',
  production: 'success',
};

const columns = [
  {
    field: 'name',
    headerName: 'Metodo de Pago',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          src={row.logo || undefined}
          variant="rounded"
          sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'primary.main' }}
        >
          {!row.logo && row.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {PROVIDER_LABELS[row.provider] || row.provider}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'environment',
    headerName: 'Entorno',
    width: 130,
    sortable: true,
    renderCell: (row) => (
      <Chip
        label={row.environment === 'production' ? 'Produccion' : 'Sandbox'}
        color={ENV_COLORS[row.environment] || 'default'}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: 'currency',
    headerName: 'Moneda',
    width: 90,
    sortable: true,
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

export default function MetodosPagoTable({
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
      createLabel="Nuevo metodo de pago"
      emptyTitle="Sin metodos de pago"
      emptyDescription="No hay metodos de pago que coincidan con los filtros aplicados."
    />
  );
}
