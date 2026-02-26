import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultThemeSettings } from './defaultTheme';

const ThemeSettingsContext = createContext(null);

export const useThemeSettings = () => useContext(ThemeSettingsContext);

export function AppThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('pidelibre-theme');
      return stored ? { ...defaultThemeSettings, ...JSON.parse(stored) } : defaultThemeSettings;
    } catch {
      return defaultThemeSettings;
    }
  });

  const updateSettings = (updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('pidelibre-theme', JSON.stringify(next));
      return next;
    });
  };

  const resetSettings = () => {
    localStorage.removeItem('pidelibre-theme');
    setSettings(defaultThemeSettings);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.mode,
          primary: { main: settings.primaryColor },
          secondary: { main: settings.secondaryColor },
          success: { main: '#10B981' },
          warning: { main: '#F59E0B' },
          error: { main: '#EF4444' },
          info: { main: '#06B6D4' },
          background: {
            default: settings.mode === 'dark' ? '#0F172A' : '#F1F5F9',
            paper: settings.mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: settings.mode === 'dark' ? '#F1F5F9' : '#1E293B',
            secondary: settings.mode === 'dark' ? '#94A3B8' : '#64748B',
          },
          divider: settings.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        },
        typography: {
          // htmlFontSize le dice a MUI cuántos px equivale 1rem (para pxToRem interno)
          htmlFontSize: settings.fontSize,
          fontFamily: `'${settings.fontFamily}', 'Inter', 'Roboto', sans-serif`,
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: settings.borderRadius },
        components: {
          // Escala el rem raíz y controla densidad de celdas globalmente
          MuiCssBaseline: {
            styleOverrides: (() => {
              const py = { compact: 4, normal: 10, comfortable: 16 }[settings.tableDensity] ?? 10;
              const pyHead = { compact: 6, normal: 12, comfortable: 16 }[settings.tableDensity] ?? 12;
              return `
                html { font-size: ${settings.fontSize}px; }
                .MuiTableCell-root {
                  padding-top: ${py}px !important;
                  padding-bottom: ${py}px !important;
                }
                .MuiTableCell-head {
                  padding-top: ${pyHead}px !important;
                  padding-bottom: ${pyHead}px !important;
                }
              `;
            })(),
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  settings.mode === 'dark'
                    ? '0 4px 6px -1px rgba(0,0,0,0.4)'
                    : '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: Math.min(settings.borderRadius, 10) },
              contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: 'none' },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                '& .MuiTableCell-head': {
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: settings.mode === 'dark' ? '#94A3B8' : '#64748B',
                  backgroundColor: settings.mode === 'dark' ? '#0F172A' : '#F8FAFC',
                },
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:last-child td': { borderBottom: 0 },
                '&:hover': {
                  backgroundColor:
                    settings.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } },
          },
          MuiTextField: {
            defaultProps: { size: 'small' },
          },
          MuiSelect: {
            defaultProps: { size: 'small' },
          },
          MuiInputBase: {
            styleOverrides: { root: { borderRadius: `${Math.min(settings.borderRadius, 8)}px !important` } },
          },
        },
      }),
    [settings]
  );

  return (
    <ThemeSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
