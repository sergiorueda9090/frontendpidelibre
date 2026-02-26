import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Button, Slider,
  ToggleButton, ToggleButtonGroup, MenuItem, TextField,
  Divider, Alert, Snackbar, Chip, alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PageHeader from '../components/common/PageHeader';
import { useThemeSettings } from './ThemeContext';
import { FONT_OPTIONS } from './defaultTheme';

const TABLE_DENSITIES = [
  {
    value: 'compact',
    label: 'Compacta',
    hint: 'Filas ajustadas, más datos visibles',
    rowHeights: [14, 14, 14, 14],
  },
  {
    value: 'normal',
    label: 'Normal',
    hint: 'Balance entre espacio y densidad',
    rowHeights: [20, 20, 20],
  },
  {
    value: 'comfortable',
    label: 'Cómoda',
    hint: 'Filas espaciosas, mayor legibilidad',
    rowHeights: [28, 28],
  },
];

const FONT_SIZES = [
  { value: 12, label: 'Compacto',    hint: '12 px' },
  { value: 14, label: 'Normal',      hint: '14 px' },
  { value: 16, label: 'Grande',      hint: '16 px' },
  { value: 18, label: 'Muy grande',  hint: '18 px' },
  { value: 21, label: 'Extra grande', hint: '21 px' },
];

const PRESET_PALETTES = [
  { primary: '#6366F1', secondary: '#EC4899', label: 'Índigo & Rosa' },
  { primary: '#0EA5E9', secondary: '#F59E0B', label: 'Azul & Ámbar' },
  { primary: '#10B981', secondary: '#6366F1', label: 'Esmeralda & Índigo' },
  { primary: '#8B5CF6', secondary: '#06B6D4', label: 'Violeta & Cian' },
  { primary: '#EF4444', secondary: '#F59E0B', label: 'Rojo & Ámbar' },
  { primary: '#F97316', secondary: '#6366F1', label: 'Naranja & Índigo' },
];

function Preview({ settings }) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2.5, bgcolor: theme.palette.background.default, borderRadius: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="caption" color="text.disabled" fontWeight={700} textTransform="uppercase" letterSpacing="0.1em" mb={2} display="block">
        Vista previa
      </Typography>

      {/* Stat card preview */}
      <Box sx={{ bgcolor: 'background.paper', borderRadius: `${Math.min(settings.borderRadius, 12)}px`, p: 2, mb: 2, boxShadow: theme.shadows[1] }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ width: 44, height: 44, borderRadius: `${Math.min(settings.borderRadius / 2, 8)}px`, bgcolor: `${settings.primaryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AttachMoneyIcon sx={{ color: settings.primaryColor, fontSize: 22 }} />
          </Box>
          <Chip label="+18%" size="small" sx={{ bgcolor: '#10B98120', color: '#10B981', fontWeight: 700, fontSize: '0.7rem' }} />
        </Stack>
        <Typography variant="h5" fontWeight={800} mt={1.5} color="text.primary" fontFamily={`'${settings.fontFamily}', sans-serif`}>
          $89,200
        </Typography>
        <Typography variant="body2" color="text.secondary" fontFamily={`'${settings.fontFamily}', sans-serif`}>
          Ventas totales
        </Typography>
      </Box>

      {/* Buttons preview */}
      <Stack direction="row" gap={1} mb={2} flexWrap="wrap">
        <Button variant="contained" size="small" disableElevation sx={{ bgcolor: settings.primaryColor, borderRadius: `${Math.min(settings.borderRadius / 1.5, 8)}px`, fontFamily: `'${settings.fontFamily}', sans-serif`, textTransform: 'none', fontWeight: 600 }}>
          Primario
        </Button>
        <Button variant="outlined" size="small" sx={{ borderColor: settings.secondaryColor, color: settings.secondaryColor, borderRadius: `${Math.min(settings.borderRadius / 1.5, 8)}px`, fontFamily: `'${settings.fontFamily}', sans-serif`, textTransform: 'none' }}>
          Secundario
        </Button>
        <Chip label="Activo" size="small" sx={{ bgcolor: `${settings.primaryColor}20`, color: settings.primaryColor, fontWeight: 700 }} />
      </Stack>

      {/* Table density preview */}
      {(() => {
        const pyHead = { compact: '6px', normal: '12px', comfortable: '16px' }[settings.tableDensity] ?? '12px';
        const pyBody = { compact: '4px', normal: '10px', comfortable: '16px' }[settings.tableDensity] ?? '10px';
        const rows = [
          { name: 'María López', role: 'Admin', status: 'Activo', roleColor: settings.primaryColor, statusColor: '#10B981' },
          { name: 'Carlos Ruiz', role: 'Editor', status: 'Activo', roleColor: settings.secondaryColor, statusColor: '#10B981' },
        ];
        return (
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: `${Math.min(settings.borderRadius / 2, 6)}px`, overflow: 'hidden', mb: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', bgcolor: `${settings.primaryColor}10`, borderBottom: `2px solid ${settings.primaryColor}30`, px: 1.5, paddingTop: pyHead, paddingBottom: pyHead }}>
              {['USUARIO', 'ROL', 'ESTADO'].map((h) => (
                <Typography key={h} sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: settings.primaryColor, fontFamily: `'${settings.fontFamily}', sans-serif`, pr: 2 }}>
                  {h}
                </Typography>
              ))}
            </Box>
            {rows.map((r, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', bgcolor: i % 2 === 0 ? 'background.paper' : `${settings.primaryColor}06`, px: 1.5, paddingTop: pyBody, paddingBottom: pyBody, alignItems: 'center', borderBottom: i < rows.length - 1 ? `1px solid ${settings.primaryColor}15` : 'none' }}>
                <Typography sx={{ fontSize: '0.8rem', fontFamily: `'${settings.fontFamily}', sans-serif`, color: 'text.primary', fontWeight: 600 }}>
                  {r.name}
                </Typography>
                <Chip label={r.role} size="small" sx={{ mr: 2, bgcolor: `${r.roleColor}18`, color: r.roleColor, fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                <Chip label={r.status} size="small" sx={{ bgcolor: `${r.statusColor}18`, color: r.statusColor, fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
              </Box>
            ))}
          </Box>
        );
      })()}

      {/* Navigation item preview */}
      <Box sx={{ bgcolor: '#111827', borderRadius: `${Math.min(settings.borderRadius / 2, 8)}px`, p: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 1, py: 0.75, borderRadius: `${Math.min(settings.borderRadius / 2, 8)}px`, bgcolor: `${settings.primaryColor}22` }}>
          <ShoppingCartIcon sx={{ color: settings.primaryColor, fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: settings.primaryColor, fontWeight: 600, fontFamily: `'${settings.fontFamily}', sans-serif` }}>Órdenes</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default function ThemeCustomizer() {
  const { settings, updateSettings, resetSettings } = useThemeSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = () => setSaved(true);

  return (
    <Box>
      <PageHeader
        title="Personalización de Tema"
        subtitle="Ajusta los colores, tipografía y estilos del panel"
        actions={
          <Stack direction="row" gap={1.5}>
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={resetSettings}>
              Restablecer
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disableElevation>
              Guardar
            </Button>
          </Stack>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Controls */}
        <Stack gap={2.5}>
          {/* Mode */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Modo de color</Typography>
              <ToggleButtonGroup
                value={settings.mode}
                exclusive
                onChange={(_, v) => v && updateSettings({ mode: v })}
                fullWidth
              >
                <ToggleButton value="light" sx={{ gap: 1, textTransform: 'none' }}>
                  <LightModeIcon fontSize="small" /> Claro
                </ToggleButton>
                <ToggleButton value="dark" sx={{ gap: 1, textTransform: 'none' }}>
                  <DarkModeIcon fontSize="small" /> Oscuro
                </ToggleButton>
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Preset Palettes */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Paletas predefinidas</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {PRESET_PALETTES.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outlined"
                    onClick={() => updateSettings({ primaryColor: preset.primary, secondaryColor: preset.secondary })}
                    sx={{
                      flexDirection: 'column', gap: 1, py: 1.5, borderRadius: 2, textTransform: 'none',
                      borderColor: settings.primaryColor === preset.primary ? preset.primary : 'divider',
                      borderWidth: settings.primaryColor === preset.primary ? 2 : 1,
                    }}
                  >
                    <Stack direction="row" gap={0.5}>
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: preset.primary }} />
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: preset.secondary }} />
                    </Stack>
                    <Typography variant="caption" fontWeight={500} lineHeight={1.2} textAlign="center" color="text.secondary">
                      {preset.label}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2.5}>Colores personalizados</Typography>
              <Stack gap={2.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Color primario</Typography>
                    <Typography variant="caption" color="text.secondary">Botones, íconos activos, énfasis</Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: settings.primaryColor, border: 1, borderColor: 'divider' }} />
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: 'none' }}
                    />
                  </Stack>
                </Stack>
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Color secundario</Typography>
                    <Typography variant="caption" color="text.secondary">Acentos y elementos secundarios</Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: settings.secondaryColor, border: 1, borderColor: 'divider' }} />
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                      style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: 'none' }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Typography & Border */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2.5}>Tipografía y bordes</Typography>
              <Stack gap={3}>
                <TextField
                  select fullWidth label="Fuente tipográfica"
                  value={settings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                >
                  {FONT_OPTIONS.map((f) => (
                    <MenuItem key={f.value} value={f.value} sx={{ fontFamily: `'${f.value}', sans-serif` }}>
                      {f.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Tamaño de letra */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>Tamaño de letra</Typography>
                      <Typography variant="caption" color="text.secondary">Afecta tablas, botones y todo el sistema</Typography>
                    </Box>
                    <Chip
                      label={FONT_SIZES.find((s) => s.value === settings.fontSize)?.hint ?? `${settings.fontSize} px`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
                    {FONT_SIZES.map((opt) => {
                      const active = settings.fontSize === opt.value;
                      return (
                        <Box
                          key={opt.value}
                          onClick={() => updateSettings({ fontSize: opt.value })}
                          sx={{
                            cursor: 'pointer',
                            border: '2px solid',
                            borderColor: active ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            py: 1.25,
                            px: 1,
                            textAlign: 'center',
                            bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.08) : 'background.paper',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: `${opt.value}px`,
                              fontWeight: 700,
                              lineHeight: 1,
                              color: active ? 'primary.main' : 'text.primary',
                              mb: 0.5,
                              display: 'block',
                            }}
                          >
                            Aa
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight={active ? 700 : 500}
                            color={active ? 'primary.main' : 'text.secondary'}
                            display="block"
                          >
                            {opt.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>Radio de bordes</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">{settings.borderRadius}px</Typography>
                  </Stack>
                  <Slider
                    value={settings.borderRadius}
                    onChange={(_, v) => updateSettings({ borderRadius: v })}
                    min={0} max={24} step={2}
                    marks={[{ value: 0, label: 'Cuadrado' }, { value: 12, label: 'Normal' }, { value: 24, label: 'Redondo' }]}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
          {/* Densidad de tabla */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={0.5}>Densidad de tabla</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2.5}>
                Controla el espacio vertical entre filas de todas las tablas
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                {TABLE_DENSITIES.map((opt) => {
                  const active = settings.tableDensity === opt.value;
                  return (
                    <Box
                      key={opt.value}
                      onClick={() => updateSettings({ tableDensity: opt.value })}
                      sx={{
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: active ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        p: 1.5,
                        bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.07) : 'background.paper',
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      {/* Filas simuladas */}
                      <Stack gap={0.5} mb={1.25}>
                        {/* cabecera */}
                        <Box sx={{
                          height: 8,
                          borderRadius: 0.5,
                          bgcolor: active ? 'primary.main' : 'action.selected',
                          opacity: active ? 0.7 : 0.5,
                          width: '80%',
                        }} />
                        {opt.rowHeights.map((h, i) => (
                          <Box
                            key={i}
                            sx={{
                              height: h,
                              borderRadius: 0.5,
                              bgcolor: active
                                ? (t) => alpha(t.palette.primary.main, i % 2 === 0 ? 0.12 : 0.06)
                                : i % 2 === 0 ? 'action.hover' : 'action.selected',
                              border: '1px solid',
                              borderColor: active
                                ? (t) => alpha(t.palette.primary.main, 0.15)
                                : 'divider',
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant="body2"
                        fontWeight={active ? 700 : 600}
                        color={active ? 'primary.main' : 'text.primary'}
                        display="block"
                        mb={0.25}
                      >
                        {opt.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" lineHeight={1.3} display="block">
                        {opt.hint}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Preview panel */}
        <Box sx={{ position: { lg: 'sticky' }, top: 80, alignSelf: 'start' }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Vista previa en tiempo real</Typography>
              <Preview settings={settings} />
              <Box sx={{ mt: 2.5, p: 2, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Los cambios se aplican instantáneamente en todo el panel. Usa "Guardar" para confirmar y persistir la configuración.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)}>
          Tema guardado correctamente
        </Alert>
      </Snackbar>
    </Box>
  );
}
