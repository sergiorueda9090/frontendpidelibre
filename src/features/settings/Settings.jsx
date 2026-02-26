import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, TextField,
  Button, Switch, FormControlLabel, Divider, Alert, Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PageHeader from '../../components/common/PageHeader';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({ storeName: 'pidelibre.com', storeEmail: 'admin@pidelibre.com', storePhone: '+52 55 1234 5678', storeAddress: 'Av. Reforma 100, CDMX', currency: 'MXN', taxRate: '16' });
  const [notifications, setNotifications] = useState({ emailOrders: true, emailLowStock: true, emailNewUsers: false, pushOrders: true });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '60' });

  const handleSave = () => {
    setSaved(true);
  };

  const SectionCard = ({ title, subtitle, children }) => (
    <Card sx={{ mb: 2.5 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={0.5}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" mb={3}>{subtitle}</Typography>}
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <PageHeader
        title="Configuración"
        subtitle="Administra las preferencias generales de tu tienda"
        actions={
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disableElevation>
            Guardar cambios
          </Button>
        }
      />

      <SectionCard title="Información de la tienda" subtitle="Datos generales de pidelibre.com">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          <TextField fullWidth label="Nombre de la tienda" value={general.storeName} onChange={(e) => setGeneral({ ...general, storeName: e.target.value })} />
          <TextField fullWidth label="Email de contacto" value={general.storeEmail} onChange={(e) => setGeneral({ ...general, storeEmail: e.target.value })} />
          <TextField fullWidth label="Teléfono" value={general.storePhone} onChange={(e) => setGeneral({ ...general, storePhone: e.target.value })} />
          <TextField fullWidth label="Moneda" value={general.currency} onChange={(e) => setGeneral({ ...general, currency: e.target.value })} />
          <TextField fullWidth label="Dirección" value={general.storeAddress} onChange={(e) => setGeneral({ ...general, storeAddress: e.target.value })} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <TextField fullWidth label="IVA (%)" type="number" value={general.taxRate} onChange={(e) => setGeneral({ ...general, taxRate: e.target.value })} inputProps={{ min: 0, max: 100 }} />
        </Box>
      </SectionCard>

      <SectionCard title="Notificaciones" subtitle="Configura cuándo y cómo recibir alertas">
        <Stack gap={1.5}>
          {[
            { key: 'emailOrders', label: 'Email al recibir nuevas órdenes' },
            { key: 'emailLowStock', label: 'Email cuando el stock esté bajo' },
            { key: 'emailNewUsers', label: 'Email al registrarse nuevos usuarios' },
            { key: 'pushOrders', label: 'Notificación push para órdenes urgentes' },
          ].map(({ key, label }) => (
            <FormControlLabel
              key={key}
              control={<Switch checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} color="primary" />}
              label={<Typography variant="body2">{label}</Typography>}
            />
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Seguridad" subtitle="Opciones de seguridad y autenticación">
        <Stack gap={2.5}>
          <FormControlLabel
            control={<Switch checked={security.twoFactor} onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })} color="primary" />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>Autenticación de dos factores</Typography>
                <Typography variant="caption" color="text.secondary">Añade una capa extra de seguridad a tu cuenta</Typography>
              </Box>
            }
          />
          <TextField
            label="Tiempo de sesión (minutos)"
            type="number"
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            sx={{ maxWidth: 300 }}
            inputProps={{ min: 15, max: 480 }}
            helperText="Tiempo de inactividad antes de cerrar la sesión"
          />
        </Stack>
      </SectionCard>

      <Snackbar open={saved} autoHideDuration={3500} onClose={() => setSaved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)} sx={{ width: '100%' }}>
          Configuración guardada correctamente
        </Alert>
      </Snackbar>
    </Box>
  );
}
