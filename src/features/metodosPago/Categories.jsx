import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clear_form_store } from '../../store/metodospagosStore/metodospagosStore';
import { get_selected_record_thunk, create_thunk, update_thunk, delete_thunk } from '../../store/metodospagosStore/metodosThunks';
import { open_modal_store, close_modal_store, read_only_store, read_view_store } from '../../store/globalStore/globalStore';
import { confirmDelete } from '../../utils/alerts';

import MetodosPagoFilters     from './components/Filters';
import MetodosPagoTable       from './components/Table';
import MetodosPagoPaginado    from './components/Paginado';
import MetodosPagoModal       from './components/Modal';
import PageHeader             from '../../components/common/PageHeader';
import MetodosPagoTableLoader from './components/loaders/TableLoader';

export default function MetodosPago() {
  const dispatch = useDispatch();

  const { data, selected_record, loading, total_count, page_size } = useSelector((s) => s.metodospagosStore);
  const { open_modal, open_modal_read_only }                       = useSelector((s) => s.globalStore);

  const [saving, setSaving] = useState(false);

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

  const handleSave = (formData) => {
    setSaving(true);
    if (formData.id) {
      dispatch(update_thunk());
    } else {
      dispatch(create_thunk());
    }
    setSaving(false);
    dispatch(close_modal_store());
  };

  const handleDelete = async (row) => {
    const ok = await confirmDelete(row.name);
    if (!ok) return;
    dispatch(delete_thunk(row.id));
  };

  return (
    <>
      <PageHeader
        title="Metodos de Pago"
        subtitle={`${total_count} metodos registrados`}
      />

      <MetodosPagoFilters resultCount={total_count} />

      <Box sx={{ position: 'relative', borderRadius: 3 }}>
        <MetodosPagoTableLoader visible={loading} />

        <MetodosPagoTable
          rows={data}
          loading={false}
          page={0}
          rowsPerPage={page_size}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <MetodosPagoPaginado />
      </Box>

      <MetodosPagoModal
        open={open_modal}
        onClose={() => dispatch(close_modal_store())}
        onSave={handleSave}
        record={selected_record}
        saving={saving}
        readOnly={open_modal_read_only}
      />
    </>
  );
}
