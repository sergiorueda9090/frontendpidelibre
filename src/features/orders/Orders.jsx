import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Typography } from '@mui/material';
import { fetchOrders, fetchOrderDetail, deleteOrder } from './ordersSlice';
import DataTable from '../../components/common/DataTable';
import OrderDetail from './OrderDetail';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

const columns = [
  {
    field: 'order_number', headerName: 'Orden', width: 170, sortable: true,
    renderCell: (row) => <Typography variant="body2" fontWeight={700} color="primary.main">{row.order_number}</Typography>,
  },
  {
    field: 'customer', headerName: 'Cliente', sortable: true, filterable: true,
    renderCell: (row) => `${row.first_name} ${row.last_name}`,
  },
  { field: 'items_count', headerName: 'Artículos', width: 90, sortable: true, align: 'center' },
  {
    field: 'total', headerName: 'Total', width: 130, sortable: true, align: 'right',
    renderCell: (row) => <Typography variant="body2" fontWeight={600}>{formatCurrency(row.total)}</Typography>,
  },
  {
    field: 'status', headerName: 'Estado', width: 140, sortable: true, filterable: true,
    renderCell: (row) => <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />,
  },
  {
    field: 'payment_method', headerName: 'Pago', width: 140, sortable: true,
    renderCell: (row) => getStatusLabel(row.payment_method),
  },
  {
    field: 'created_at', headerName: 'Fecha', width: 120, sortable: true,
    renderCell: (row) => formatDate(row.created_at),
  },
];

export default function Orders() {
  const dispatch = useDispatch();
  const { items, loading, saving } = useSelector((s) => s.orders);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const handleEdit = (row) => {
    dispatch(fetchOrderDetail(row.order_number)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setSelected(res.payload);
        setDetailOpen(true);
      }
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await dispatch(deleteOrder(deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const approvedStatuses = ['approved', 'shipped', 'delivered'];
  const totalRevenue = items
    .filter((o) => approvedStatuses.includes(o.status))
    .reduce((acc, o) => acc + parseFloat(o.total || 0), 0);

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={`${items.length} pedidos · ${formatCurrency(totalRevenue)} en ventas aprobadas`}
      />
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        searchPlaceholder="Buscar por cliente, estado, número de orden..."
      />
      <OrderDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={selected}
        saving={saving}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title={`¿Eliminar orden "${deleteTarget?.order_number}"?`}
        description="Se eliminará la orden permanentemente."
      />
    </>
  );
}
