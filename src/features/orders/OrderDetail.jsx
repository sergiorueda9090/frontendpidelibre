import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Divider, Box, Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];

export default function OrderDetail({ open, onClose, order, onStatusChange, saving }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>Orden {order.id}</Typography>
            <Typography variant="caption" color="text.secondary">{formatDate(order.date)}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2.5 }}>
        <Stack gap={2.5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Cliente</Typography>
              <Typography variant="body2" fontWeight={600}>{order.customer}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Total</Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">{formatCurrency(order.total)}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Artículos</Typography>
              <Typography variant="body2" fontWeight={600}>{order.items} artículo{order.items !== 1 ? 's' : ''}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Pago</Typography>
              <Typography variant="body2" fontWeight={600}>{getStatusLabel(order.paymentMethod)}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Dirección de envío</Typography>
            <Typography variant="body2">{order.address}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Actualizar estado</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {STATUS_OPTIONS.map((s) => (
                <Chip
                  key={s}
                  label={getStatusLabel(s)}
                  color={getStatusColor(s)}
                  variant={order.status === s ? 'filled' : 'outlined'}
                  onClick={() => onStatusChange({ ...order, status: s })}
                  clickable
                  sx={{ fontWeight: order.status === s ? 700 : 500 }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
