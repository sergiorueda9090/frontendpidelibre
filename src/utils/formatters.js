export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));

export const formatNumber = (num) =>
  new Intl.NumberFormat('es-CO').format(num);

export const getStatusColor = (status) => {
  const map = {
    active: 'success', inactive: 'default', blocked: 'error',
    pending: 'warning', processing: 'info',
    completed: 'success', cancelled: 'error',
    admin: 'primary', editor: 'secondary', customer: 'default',
    // Estados de orden del backend
    pending_payment: 'warning', approved: 'success', rejected: 'error',
    shipped: 'info', delivered: 'success',
    // Estados de pago
    refunded: 'warning',
  };
  return map[status] || 'default';
};

export const getStatusLabel = (status) => {
  const map = {
    active: 'Activo', inactive: 'Inactivo', blocked: 'Bloqueado',
    pending: 'Pendiente', processing: 'En proceso',
    completed: 'Completado', cancelled: 'Cancelado',
    admin: 'Administrador', editor: 'Editor', customer: 'Cliente',
    credit_card: 'Tarjeta de crédito', paypal: 'PayPal', bank_transfer: 'Transferencia',
    // Estados de orden del backend
    pending_payment: 'Pendiente de pago', approved: 'Aprobado', rejected: 'Rechazado',
    shipped: 'Enviado', delivered: 'Entregado',
    // Métodos de pago
    mercadopago: 'Mercado Pago', wompi: 'Wompi',
    // Estados de pago
    refunded: 'Reembolsado',
  };
  return map[status] || status;
};

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
