import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Avatar, Stack, Typography, Box } from '@mui/material';
import { fetchClients, createClient, updateClient, deleteClient, toggleClient } from './clientsSlice';
import DataTable from '../../components/common/DataTable';
import FilterPanel from '../../components/common/FilterPanel';
import Pagination from '../../components/common/Pagination';
import ClientModal from './ClientModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import {
  formatCurrency, formatDate, getStatusColor, getStatusLabel, getInitials,
} from '../../utils/formatters';

// ── Definición de columnas ─────────────────────────────────────────────────
const columns = [
  {
    field: 'name',
    headerName: 'Cliente',
    sortable: true,
    renderCell: (row) => (
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Avatar
          sx={{
            width: 32, height: 32,
            fontSize: '0.78rem', fontWeight: 700,
            bgcolor: 'primary.main',
          }}
        >
          {getInitials(row.name)}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  { field: 'phone', headerName: 'Teléfono', width: 160 },
  { field: 'city', headerName: 'Ciudad', width: 150, sortable: true },
  {
    field: 'totalSpent',
    headerName: 'Total gastado',
    width: 140,
    sortable: true,
    align: 'right',
    renderCell: (row) => (
      <Typography variant="body2" fontWeight={700} color="primary.main">
        {formatCurrency(row.totalSpent)}
      </Typography>
    ),
  },
  { field: 'orders', headerName: 'Órdenes', width: 90, sortable: true, align: 'center' },
  {
    field: 'lastOrder',
    headerName: 'Última orden',
    width: 125,
    sortable: true,
    renderCell: (row) => row.lastOrder ? formatDate(row.lastOrder) : '—',
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 110,
    sortable: true,
    renderCell: (row) => (
      <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />
    ),
  },
  {
    field: 'joined',
    headerName: 'Registro',
    width: 115,
    sortable: true,
    renderCell: (row) => formatDate(row.joined),
  },
];

// ── Configuración de filtros ───────────────────────────────────────────────
const CITIES = [
  'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla',
  'Querétaro', 'Tijuana', 'Mérida', 'Culiacán', 'Chihuahua', 'León',
];

const FILTER_FIELDS = [
  {
    key: 'search',
    label: 'Buscar',
    type: 'text',
    placeholder: 'Nombre, correo electrónico...',
  },
  {
    key: 'city',
    label: 'Ciudad',
    type: 'select',
    options: CITIES.map((c) => ({ value: c, label: c })),
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'blocked', label: 'Bloqueado' },
    ],
  },
];

// ── Lógica de filtrado ─────────────────────────────────────────────────────
function applyFilters(items, filters) {
  const q = filters.search?.toLowerCase().trim() ?? '';
  return items.filter((client) => {
    const matchSearch =
      !q ||
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q);

    const matchCity =
      !filters.city || filters.city === 'all' || client.city === filters.city;

    const matchStatus =
      !filters.status || filters.status === 'all' || client.status === filters.status;

    return matchSearch && matchCity && matchStatus;
  });
}

// ── Componente ─────────────────────────────────────────────────────────────
export default function Clients() {
  const dispatch = useDispatch();
  const { items, loading, saving } = useSelector((s) => s.clients);

  const [filters,       setFilters]       = useState({});
  const [page,          setPage]          = useState(0);
  const [rowsPerPage,   setRowsPerPage]   = useState(10);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const filteredItems = useMemo(
    () => applyFilters(items, filters),
    [items, filters],
  );

  useEffect(() => { setPage(0); }, [filteredItems.length]);

  const handleView   = (row) => { setSelected(row); setModalReadOnly(true);  setModalOpen(true); };
  const handleEdit   = (row) => { setSelected(row); setModalReadOnly(false); setModalOpen(true); };
  const handleCreate = ()    => { setSelected(null); setModalReadOnly(false); setModalOpen(true); };
  const handleToggle = (row) => dispatch(toggleClient(row));

  const handleSave = async (data) => {
    if (data.id) await dispatch(updateClient(data));
    else await dispatch(createClient(data));
    setModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await dispatch(deleteClient(deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const activeCount = items.filter((c) => c.status === 'active').length;
  const totalRevenue = items.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${items.length} clientes · ${activeCount} activos · ${formatCurrency(totalRevenue)} en ventas`}
      />

      <FilterPanel
        fields={FILTER_FIELDS}
        onChange={setFilters}
        onClear={() => setFilters({})}
        resultCount={filteredItems.length}
      />

      <DataTable
        columns={columns}
        rows={filteredItems}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onView={handleView}
        onEdit={handleEdit}
        onToggle={handleToggle}
        isActive={(row) => row.status === 'active'}
        onDelete={setDeleteTarget}
        onCreate={handleCreate}
        createLabel="Nuevo cliente"
        emptyTitle="Sin clientes"
        emptyDescription="No hay clientes que coincidan con los filtros aplicados."
      />

      <Pagination
        count={filteredItems.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }}
      />

      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        client={selected}
        saving={saving}
        readOnly={modalReadOnly}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title={`¿Eliminar a "${deleteTarget?.name}"?`}
        description="Se eliminará el cliente y todos sus datos permanentemente."
      />
    </>
  );
}
