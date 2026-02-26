import { configureStore } from '@reduxjs/toolkit';
import usersReducer    from '../features/users/usersSlice';
import clientsReducer  from '../features/clients/clientsSlice';
import userReducer     from '../store/userStore/userStore';
import globalReducer   from '../store/globalStore/globalStore';
import authReducer     from '../store/authStore/authStore';

export const store = configureStore({
  reducer: {
    users      : usersReducer,
    clients    : clientsReducer,
    userStore  : userReducer,
    globalStore: globalReducer,
    authStore  : authReducer,
  },
});
