import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppThemeProvider } from './theme/ThemeContext';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <AppRouter />
      </AppThemeProvider>
    </Provider>
  );
}
