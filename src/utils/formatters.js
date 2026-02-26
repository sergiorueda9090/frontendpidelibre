export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));

export const formatNumber = (num) =>
  new Intl.NumberFormat('es-MX').format(num);

export const getStatusColor = (status) => {
  const map = {
    active: 'success', inactive: 'default', blocked: 'error',
    pending: 'warning', processing: 'info',
    completed: 'success', cancelled: 'error',
    admin: 'primary', editor: 'secondary', customer: 'default',
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
  };
  return map[status] || status;
};

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
