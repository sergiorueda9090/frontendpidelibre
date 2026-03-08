import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Divider, Box, Chip,
  IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';

export default function OrderDetail({ open, onClose, order, saving }) {
  if (!order) return null;

  const customerName = `${order.first_name} ${order.last_name}`;
  const fullAddress = [order.address, order.address2, order.city, order.state, order.country]
    .filter(Boolean)
    .join(', ');

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>Pedido {order.order_number}</Typography>
            <Typography variant="caption" color="text.secondary">{formatDate(order.created_at)}</Typography>
          </Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <Chip label={getStatusLabel(order.status)} color={getStatusColor(order.status)} size="small" />
            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2.5 }}>
        <Stack gap={2.5}>
          {/* Info del cliente */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Cliente</Typography>
              <Typography variant="body2" fontWeight={600}>{customerName}</Typography>
              <Typography variant="caption" color="text.secondary">{order.email}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Teléfono</Typography>
              <Typography variant="body2" fontWeight={600}>{order.phone}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Método de pago</Typography>
              <Typography variant="body2" fontWeight={600}>{getStatusLabel(order.payment_method)}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Dirección de envío</Typography>
            <Typography variant="body2">{fullAddress}</Typography>
          </Box>

          {order.notes && (
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Notas</Typography>
              <Typography variant="body2">{order.notes}</Typography>
            </Box>
          )}

          <Divider />

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Productos</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Cant.</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ width: 50 }}>
                        {item.product_image ? (
                          <Avatar src={item.product_image} variant="rounded" sx={{ width: 40, height: 40 }} />
                        ) : (
                          <Avatar variant="rounded" sx={{ width: 40, height: 40, fontSize: 12 }}>
                            {item.product_name?.charAt(0)}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{item.product_name}</Typography>
                        {item.sku && <Typography variant="caption" color="text.secondary">SKU: {item.sku}</Typography>}
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Totales */}
          <Stack alignItems="flex-end" gap={0.5}>
            <Stack direction="row" gap={4}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
            </Stack>
            <Stack direction="row" gap={4}>
              <Typography variant="body2" color="text.secondary">Envío</Typography>
              <Typography variant="body2">{formatCurrency(order.shipping_cost)}</Typography>
            </Stack>
            <Divider sx={{ width: 200, my: 0.5 }} />
            <Stack direction="row" gap={4}>
              <Typography variant="body2" fontWeight={700}>Total</Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">{formatCurrency(order.total)}</Typography>
            </Stack>
          </Stack>

          {/* Pagos */}
          {order.payments && order.payments.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Pagos</Typography>
                <Stack gap={1}>
                  {order.payments.map((payment) => (
                    <Box key={payment.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={getStatusLabel(payment.status)}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                      <Typography variant="body2">{getStatusLabel(payment.provider)}</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatCurrency(payment.amount)}</Typography>
                      {payment.transaction_id && (
                        <Typography variant="caption" color="text.secondary">ID: {payment.transaction_id}</Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
