import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clear_form_store } from '../../store/productsStore/productsStore';
import { get_selected_record_thunk, create_thunk, update_thunk, delete_thunk } from '../../store/productsStore/productsThunks';
import { open_modal_store, close_modal_store, read_only_store, read_view_store } from '../../store/globalStore/globalStore';
import { get_all_thunk as get_all_categories_thunk } from '../../store/categoryStore/categoryThunks';
import { get_all_thunk as get_all_brands_thunk } from '../../store/brandStore/brandThunks';
import { get_all_thunk as get_all_genders_thunk } from '../../store/genderStore/genderThunks';
import { confirmDelete } from '../../utils/alerts';

import ProductsFilters  from './components/Filters';
import ProductsTable    from './components/Table';
import ProductsPaginado from './components/Paginado';
import ProductModal     from './components/Modal';
import PageHeader       from '../../components/common/PageHeader';
import ProductsLoader   from './components/loaders/TableLoader';

export default function Products() {
  const dispatch = useDispatch();

  const { data, selected_record, loading, total_count, page_size } = useSelector((s) => s.productsStore);
  const { open_modal, open_modal_read_only }                        = useSelector((s) => s.globalStore);
  const categoriesLoaded = useSelector((s) => s.categoryStore.data.length > 0);
  const brandsLoaded     = useSelector((s) => s.brandStore.data.length > 0);
  const gendersLoaded    = useSelector((s) => s.genderStore.data.length > 0);

  const [saving, setSaving] = useState(false);

  // Carga categorías, marcas y géneros para los selects del modal
  useEffect(() => {
    if (!categoriesLoaded) dispatch(get_all_categories_thunk());
    if (!brandsLoaded)     dispatch(get_all_brands_thunk());
    if (!gendersLoaded)    dispatch(get_all_genders_thunk());
  }, [dispatch, categoriesLoaded, brandsLoaded, gendersLoaded]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleView = (row) => {
    dispatch(get_selected_record_thunk(row));
    dispatch(read_only_store());
    dispatch(open_modal_store());
  };

  const handleEdit = (row) => {
    dispatch(get_selected_record_thunk(row));
    dispatch(read_view_store());
    dispatch(open_modal_store());
  };

  const handleCreate = () => {
    dispatch(clear_form_store());
    dispatch(read_view_store());
    dispatch(open_modal_store());
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (formData.id) {
        await dispatch(update_thunk({
          coverImage:      formData.coverImage,
          galleryFiles:    formData.galleryFiles,
          removedImageIds: formData.removedImageIds,
        }));
      } else {
        await dispatch(create_thunk({
          coverImage:   formData.coverImage,
          galleryFiles: formData.galleryFiles,
        }));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    const ok = await confirmDelete(row.name);
    if (!ok) return;
    dispatch(delete_thunk(row.id));
  };

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={`${total_count} productos registrados`}
      />

      <ProductsFilters resultCount={total_count} />

      <Box sx={{ position: 'relative', borderRadius: 3 }}>
        <ProductsLoader visible={loading} />

        <ProductsTable
          rows={data}
          loading={false}
          page={0}
          rowsPerPage={page_size}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <ProductsPaginado />
      </Box>

      <ProductModal
        open={open_modal}
        onClose={() => dispatch(close_modal_store())}
        onSave={handleSave}
        product={selected_record}
        saving={saving}
        readOnly={open_modal_read_only}
      />
    </>
  );
}
