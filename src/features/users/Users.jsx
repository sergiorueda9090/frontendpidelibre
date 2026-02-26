import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_records_store, clear_form_store } from '../../store/userStore/userStore';
import { get_selected_record_thunk, create_thunk, update_thunk, delete_thunk } from '../../store/userStore/userThunks';
import { open_modal_store, close_modal_store, read_only_store, read_view_store } from '../../store/globalStore/globalStore';
import { confirmDelete } from '../../utils/alerts';

import UsersFilters     from './components/Filters';
import UsersTable       from './components/Table';
import UsersPaginado    from './components/Paginado';
import UsersModal       from './components/Modal';
import PageHeader       from '../../components/common/PageHeader';
import UsersTableLoader from './components/loaders/TableLoader';

export default function Users() {
  const dispatch = useDispatch();

  const { data, selected_record, loading, total_count, page_size } = useSelector((s) => s.userStore);
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

  const handleToggle = (row) => {
    const updated = data.map((u) =>
      u.id === row.id
        ? { ...u, is_active: !u.is_active }
        : u
    );
    dispatch(get_all_records_store({ records: updated }));
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
    const ok = await confirmDelete(row.username ?? row.name);
    if (!ok) return;
    dispatch(delete_thunk(row.id));
  };

  const adminCount = data.filter((u) => u.is_superuser || u.role === 'admin').length;

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle={`${total_count} usuarios del panel · ${adminCount} administradores`}
      />

      <UsersFilters resultCount={total_count} />

      <Box sx={{ position: 'relative', borderRadius: 3 }}>
        <UsersTableLoader visible={loading} />

        <UsersTable
          rows={data}
          loading={false}
          page={0}
          rowsPerPage={page_size}
          onView={handleView}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <UsersPaginado />
      </Box>

      <UsersModal
        open={open_modal}
        onClose={() => dispatch(close_modal_store())}
        onSave={handleSave}
        user={selected_record}
        saving={saving}
        readOnly={open_modal_read_only}
      />
    </>
  );
}
