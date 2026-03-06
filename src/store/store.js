import { configureStore } from '@reduxjs/toolkit'
import { userStore } from './userStore/userStore'
import { globalStore } from './globalStore/globalStore'
import { authStore } from './authStore/authStore'
import { categoryStore } from './categoryStore/categoryStore'
import { attributeStore } from './attributeStore/attributeStore'
import { attributeValuesStore } from './attributeValuesStore/attributeValuesStore'
import {productsStore } from './productsStore/productsStore'
import { brandStore } from './brandStore/brandStore'
import { genderStore } from './genderStore/genderStore'
import { customerStore } from './customerStore/customerStore'

export const store = configureStore({
  reducer: {
    userStore: userStore.reducer,
    globalStore: globalStore.reducer,
    authStore: authStore.reducer,
    categoryStore: categoryStore.reducer,
    attributeStore: attributeStore.reducer,
    attributeValuesStore: attributeValuesStore.reducer,
    productsStore: productsStore.reducer,
    brandStore: brandStore.reducer,
    genderStore: genderStore.reducer,
    customerStore: customerStore.reducer,
    },
})