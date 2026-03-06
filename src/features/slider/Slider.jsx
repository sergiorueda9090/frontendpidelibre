import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clear_form_store } from '../../store/sliderStore/sliderStore';
import { get_selected_record_thunk, create_thunk, update_thunk, delete_thunk } from '../../store/sliderStore/sliderThunks';
import { open_modal_store, close_modal_store, read_only_store, read_view_store } from '../../store/globalStore/globalStore';
import { confirmDelete } from '../../utils/alerts';

import SliderFilters     from './components/Filters';
import SliderTable       from './components/Table';
import SliderPaginado    from './components/Paginado';
import SliderModal       from './components/Modal';
import PageHeader        from '../../components/common/PageHeader';
import SliderTableLoader from './components/loaders/TableLoader';

export default function Slider() {
  const dispatch = useDispatch();

  const { data, selected_record, loading, total_count, page_size } = useSelector((s) => s.sliderStore);
  const { open_modal, open_modal_read_only }                        = useSelector((s) => s.globalStore);

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
    const ok = await confirmDelete(row.title);
    if (!ok) return;
    dispatch(delete_thunk(row.id));
  };

  return (
    <>
      <PageHeader
        title="Sliders"
        subtitle={`${total_count} sliders registrados`}
      />

      <SliderFilters resultCount={total_count} />

      <Box sx={{ position: 'relative', borderRadius: 3 }}>
        <SliderTableLoader visible={loading} />

        <SliderTable
          rows={data}
          loading={false}
          page={0}
          rowsPerPage={page_size}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <SliderPaginado />
      </Box>

      <SliderModal
        open={open_modal}
        onClose={() => dispatch(close_modal_store())}
        onSave={handleSave}
        slider={selected_record}
        saving={saving}
        readOnly={open_modal_read_only}
      />
    </>
  );
}
