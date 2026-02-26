import React from 'react';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import DataTable from './DataTable';
import { getStatusColor, getStatusLabel, getInitials } from '../../../utils/formatters';
import { useDispatch } from 'react-redux';
import { get_all_thunk } from '../../../store/userStore/userThunks';
import { useEffect } from 'react';

const columns = [
  {
    field: 'username',
    headerName: 'Username',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Avatar
          src={row.profile_image || undefined}
          sx={{ width: 32, height: 32, fontSize: '0.78rem', fontWeight: 700, bgcolor: 'secondary.main' }}
        >
          {!row.profile_image && getInitials(row.username)}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>{row.username}</Typography>
          <Typography variant="caption" color="text.secondary">{row.email}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 160,
  },
  {
    field: 'role',
    headerName: 'Rol',
    width: 140,
  },
  {
    field: 'first_name',
    headerName: 'Primer Nombre',
    width: 120,
  },
  {
    field: 'last_name',
    headerName: 'Apellido',
    width: 120,
  },
  {
    field: 'is_active',
    headerName: 'Estado',
    width: 120,
    sortable: true,
    renderCell: (row) => (
      row.is_active ? <Chip label={getStatusLabel("Activo")} color={getStatusColor("active")} size="small" />
      : row.is_active === false ? <Chip label={getStatusLabel("Inactivo")} color={getStatusColor("inactive  ")}   size="small" />
      : <Chip label={getStatusLabel("Desconocido")} color={getStatusColor("cancelled")}  size="small" />
    ),
  },
];

export default function UsersTable({
  rows,
  loading,
  page,
  rowsPerPage,
  onView,
  onEdit,
  onToggle,
  onDelete,
  onCreate,
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
      onToggle={onToggle}
      isActive={(row) => row.is_active}
      onDelete={onDelete}
      onCreate={onCreate}
      createLabel="Nuevo usuario"
      emptyTitle="Sin usuarios"
      emptyDescription="No hay usuarios que coincidan con los filtros aplicados."
    />
  );
}
