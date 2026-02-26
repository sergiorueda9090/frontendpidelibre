import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Typography } from '@mui/material';
import { fetchOrders, updateOrder, deleteOrder } from './ordersSlice';
import DataTable from '../../components/common/DataTable';
import OrderDetail from './OrderDetail';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

const columns = [
  { field: 'id', headerName: 'Orden', width: 110, sortable: true, renderCell: (row) => <Typography variant="body2" fontWeight={700} color="primary.main">{row.id}</Typography> },
  { field: 'customer', headerName: 'Cliente', sortable: true, filterable: true },
  { field: 'items', headerName: 'Artículos', width: 90, sortable: true, align: 'center' },
  { field: 'total', headerName: 'Total', width: 120, sortable: true, align: 'right', renderCell: (row) => <Typography variant="body2" fontWeight={600}>{formatCurrency(row.total)}</Typography> },
  {
    field: 'status', headerName: 'Estado', width: 120, sortable: true, filterable: true,
    renderCell: (row) => <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />,
  },
  { field: 'paymentMethod', headerName: 'Pago', width: 140, sortable: true, renderCell: (row) => getStatusLabel(row.paymentMethod) },
  { field: 'date', headerName: 'Fecha', width: 110, sortable: true, renderCell: (row) => formatDate(row.date) },
];

export default function Orders() {
  const dispatch = useDispatch();
  const { items, loading, saving } = useSelector((s) => s.orders);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const handleEdit = (row) => { setSelected(row); setDetailOpen(true); };
  const handleStatusChange = async (updated) => {
    await dispatch(updateOrder(updated));
    setSelected(updated);
  };
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await dispatch(deleteOrder(deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const totalRevenue = items.filter((o) => o.status === 'completed').reduce((acc, o) => acc + o.total, 0);

  return (
    <>
      <PageHeader title="Órdenes" subtitle={`${items.length} órdenes · ${formatCurrency(totalRevenue)} en ventas completadas`} />
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        searchPlaceholder="Buscar por cliente, estado, ID..."
      />
      <OrderDetail open={detailOpen} onClose={() => setDetailOpen(false)} order={selected} onStatusChange={handleStatusChange} saving={saving} />
      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={deleting} title={`¿Eliminar orden "${deleteTarget?.id}"?`} description="Se eliminará la orden permanentemente." />
    </>
  );
}
