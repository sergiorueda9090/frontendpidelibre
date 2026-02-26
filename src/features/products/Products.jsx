import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from '@mui/material';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './productsSlice';
import DataTable from '../../components/common/DataTable';
import ProductModal from './ProductModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

const columns = [
  { field: 'sku', headerName: 'SKU', width: 100, sortable: true, filterable: true },
  { field: 'name', headerName: 'Producto', sortable: true, filterable: true, renderCell: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
  { field: 'category', headerName: 'Categoría', width: 140, sortable: true, filterable: true },
  { field: 'price', headerName: 'Precio', width: 120, sortable: true, align: 'right', renderCell: (row) => formatCurrency(row.price) },
  { field: 'stock', headerName: 'Stock', width: 80, sortable: true, align: 'center' },
  {
    field: 'status', headerName: 'Estado', width: 100, sortable: true,
    renderCell: (row) => <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />,
  },
  { field: 'createdAt', headerName: 'Creado', width: 110, sortable: true, renderCell: (row) => formatDate(row.createdAt) },
];

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, saving } = useSelector((s) => s.products);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const handleEdit = (row) => { setSelected(row); setModalOpen(true); };
  const handleCreate = () => { setSelected(null); setModalOpen(true); };
  const handleSave = async (data) => {
    if (data.id) await dispatch(updateProduct(data));
    else await dispatch(createProduct(data));
    setModalOpen(false);
  };
  const handleDeleteClick = (row) => setDeleteTarget(row);
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await dispatch(deleteProduct(deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={`${items.length} productos registrados`}
      />
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        createLabel="Nuevo producto"
        searchPlaceholder="Buscar producto, SKU, categoría..."
      />
      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} product={selected} saving={saving} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title={`¿Eliminar "${deleteTarget?.name}"?`}
        description="Se eliminará el producto permanentemente. Esta acción no se puede deshacer."
      />
    </>
  );
}
