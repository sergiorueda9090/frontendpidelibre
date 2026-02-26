import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clear_form_store } from '../../store/attributeValuesStore/attributeValuesStore';
import { get_selected_record_thunk, create_thunk, update_thunk, delete_thunk } from '../../store/attributeValuesStore/attributeValuesThunks';
import { open_modal_store, close_modal_store, read_only_store, read_view_store } from '../../store/globalStore/globalStore';
import { get_all_thunk as get_all_attributes_thunk } from '../../store/attributeStore/attributeThunks';
import { confirmDelete } from '../../utils/alerts';

import AttributesValuesFilters   from './components/Filters';
import AttributesValuesTable     from './components/Table';
import AttributesValuesPaginado  from './components/Paginado';
import AttributeValueModal       from './components/Modal';
import PageHeader                from '../../components/common/PageHeader';
import AttributesValuesLoader    from './components/loaders/TableLoader';

export default function AttributesValues() {
  const dispatch = useDispatch();

  const { data, selected_record, loading, total_count, page_size } = useSelector((s) => s.attributeValuesStore);
  const { open_modal, open_modal_read_only }                        = useSelector((s) => s.globalStore);
  const attributesLoaded = useSelector((s) => s.attributeStore.data.length > 0);

  const [saving, setSaving] = useState(false);

  // Carga la lista de atributos para el select del modal y filtros
  useEffect(() => {
    if (!attributesLoaded) {
      dispatch(get_all_attributes_thunk());
    }
  }, [dispatch, attributesLoaded]);

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
    const ok = await confirmDelete(row.value);
    if (!ok) return;
    dispatch(delete_thunk(row.id));
  };

  return (
    <>
      <PageHeader
        title="Valores de atributo"
        subtitle={`${total_count} valores registrados`}
      />

      <AttributesValuesFilters resultCount={total_count} />

      <Box sx={{ position: 'relative', borderRadius: 3 }}>
        <AttributesValuesLoader visible={loading} />

        <AttributesValuesTable
          rows={data}
          loading={false}
          page={0}
          rowsPerPage={page_size}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <AttributesValuesPaginado />
      </Box>

      <AttributeValueModal
        open={open_modal}
        onClose={() => dispatch(close_modal_store())}
        onSave={handleSave}
        attributeValue={selected_record}
        saving={saving}
        readOnly={open_modal_read_only}
      />
    </>
  );
}
