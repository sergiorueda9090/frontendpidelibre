import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_pagination_store } from '../../../store/customerStore/customerStore';
import { get_filter_thunk } from '../../../store/customerStore/customerThunks';
import Pagination from '../../../components/common/Pagination';

export default function CustomerPaginado() {
  const dispatch = useDispatch();
  const { total_count, current_page, page_size } = useSelector((s) => s.customerStore);

  const handlePageChange = (newPage) => {
    dispatch(set_pagination_store({ current_page: newPage }));
    dispatch(get_filter_thunk());
  };

  const handleRowsPerPageChange = (newSize) => {
    dispatch(set_pagination_store({ page_size: newSize, current_page: 0 }));
    dispatch(get_filter_thunk());
  };

  return (
    <Pagination
      count={total_count}
      page={current_page}
      rowsPerPage={page_size}
      onPageChange={handlePageChange}
      rowsPerPageOptions={[5, 10, 25]}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
}
