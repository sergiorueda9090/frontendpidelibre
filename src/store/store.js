import { configureStore } from '@reduxjs/toolkit'
import { userStore } from './userStore/userStore'
import { globalStore } from './globalStore/globalStore'
import { authStore } from './authStore/authStore'
import { categoryStore } from './categoryStore/categoryStore'

export const store = configureStore({
  reducer: {
    userStore: userStore.reducer,
    globalStore: globalStore.reducer,
    authStore: authStore.reducer,
    categoryStore: categoryStore.reducer,
    },
})