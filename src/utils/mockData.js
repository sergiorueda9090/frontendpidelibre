// ── Usuarios admin/staff ────────────────────────────────────────────────────
export const mockUsers = [
  { id: 1, name: 'Carlos Martínez', email: 'carlos@pidelibre.com', role: 'admin', status: 'active', phone: '+52 55 1000 0001', joined: '2024-01-01' },
  { id: 2, name: 'María González', email: 'maria@pidelibre.com', role: 'editor', status: 'active', phone: '+52 55 1000 0002', joined: '2024-01-15' },
  { id: 3, name: 'Isabel Martín', email: 'isabel@pidelibre.com', role: 'editor', status: 'active', phone: '+52 55 1000 0003', joined: '2024-04-10' },
  { id: 4, name: 'Rodrigo Vega', email: 'rodrigo@pidelibre.com', role: 'editor', status: 'inactive', phone: '+52 55 1000 0004', joined: '2024-06-01' },
  { id: 5, name: 'Paola Reyes', email: 'paola@pidelibre.com', role: 'admin', status: 'active', phone: '+52 55 1000 0005', joined: '2024-07-20' },
];

// ── Clientes (compradores) ──────────────────────────────────────────────────
export const mockClients = [
  { id: 1, name: 'Jorge Rodríguez', email: 'jorge@example.com', phone: '+52 55 2000 0001', city: 'Ciudad de México', status: 'active', totalSpent: 3249.96, orders: 12, lastOrder: '2024-07-25', joined: '2024-02-01' },
  { id: 2, name: 'Ana López', email: 'ana@example.com', phone: '+52 33 2000 0002', city: 'Guadalajara', status: 'active', totalSpent: 1199.97, orders: 8, lastOrder: '2024-07-21', joined: '2024-02-10' },
  { id: 3, name: 'Pedro Sánchez', email: 'pedro@example.com', phone: '+52 81 2000 0003', city: 'Monterrey', status: 'inactive', totalSpent: 299.97, orders: 3, lastOrder: '2024-05-14', joined: '2024-03-01' },
  { id: 4, name: 'Laura Hernández', email: 'laura@example.com', phone: '+52 55 2000 0004', city: 'Ciudad de México', status: 'active', totalSpent: 4799.94, orders: 25, lastOrder: '2024-07-23', joined: '2024-03-15' },
  { id: 5, name: 'Roberto García', email: 'roberto@example.com', phone: '+52 667 200 0005', city: 'Culiacán', status: 'active', totalSpent: 1279.94, orders: 6, lastOrder: '2024-07-20', joined: '2024-04-01' },
  { id: 6, name: 'Miguel Pérez', email: 'miguel@example.com', phone: '+52 222 200 0006', city: 'Puebla', status: 'active', totalSpent: 369.95, orders: 15, lastOrder: '2024-07-24', joined: '2024-05-01' },
  { id: 7, name: 'Carmen Flores', email: 'carmen@example.com', phone: '+52 664 200 0007', city: 'Tijuana', status: 'active', totalSpent: 799.98, orders: 4, lastOrder: '2024-07-18', joined: '2024-05-15' },
  { id: 8, name: 'Fernando Torres', email: 'fernando@example.com', phone: '+52 55 2000 0008', city: 'Ciudad de México', status: 'inactive', totalSpent: 149.99, orders: 1, lastOrder: '2024-06-10', joined: '2024-06-01' },
  { id: 9, name: 'Sofía Ramírez', email: 'sofia@example.com', phone: '+52 477 200 0009', city: 'León', status: 'active', totalSpent: 829.95, orders: 9, lastOrder: '2024-07-19', joined: '2024-06-10' },
  { id: 10, name: 'Diego Jiménez', email: 'diego@example.com', phone: '+52 55 2000 0010', city: 'Ciudad de México', status: 'active', totalSpent: 6449.95, orders: 18, lastOrder: '2024-07-25', joined: '2024-07-01' },
  { id: 11, name: 'Valentina Cruz', email: 'valentina@example.com', phone: '+52 999 200 0011', city: 'Mérida', status: 'active', totalSpent: 1049.96, orders: 7, lastOrder: '2024-07-17', joined: '2024-07-15' },
  { id: 12, name: 'Alejandro Morales', email: 'alejandro@example.com', phone: '+52 442 200 0012', city: 'Querétaro', status: 'active', totalSpent: 3839.95, orders: 22, lastOrder: '2024-07-22', joined: '2024-08-01' },
  { id: 13, name: 'Gabriela Ortega', email: 'gabriela@example.com', phone: '+52 614 200 0013', city: 'Chihuahua', status: 'active', totalSpent: 649.99, orders: 5, lastOrder: '2024-07-15', joined: '2024-08-05' },
  { id: 14, name: 'Héctor Castillo', email: 'hector@example.com', phone: '+52 55 2000 0014', city: 'Ciudad de México', status: 'active', totalSpent: 2199.98, orders: 11, lastOrder: '2024-07-20', joined: '2024-08-10' },
  { id: 15, name: 'Natalia Vargas', email: 'natalia@example.com', phone: '+52 33 2000 0015', city: 'Guadalajara', status: 'active', totalSpent: 3599.97, orders: 14, lastOrder: '2024-07-24', joined: '2024-08-12' },
  { id: 16, name: 'Ernesto Luna', email: 'ernesto@example.com', phone: '+52 81 2000 0016', city: 'Monterrey', status: 'inactive', totalSpent: 89.99, orders: 1, lastOrder: '2024-07-01', joined: '2024-08-15' },
  { id: 17, name: 'Patricia Mendoza', email: 'patricia@example.com', phone: '+52 55 2000 0017', city: 'Ciudad de México', status: 'active', totalSpent: 1879.97, orders: 10, lastOrder: '2024-07-23', joined: '2024-08-18' },
  { id: 18, name: 'Luis Guzmán', email: 'luis@example.com', phone: '+52 222 200 0018', city: 'Puebla', status: 'active', totalSpent: 549.98, orders: 3, lastOrder: '2024-07-19', joined: '2024-08-20' },
  { id: 19, name: 'Claudia Serrano', email: 'claudia@example.com', phone: '+52 667 200 0019', city: 'Culiacán', status: 'active', totalSpent: 999.99, orders: 6, lastOrder: '2024-07-22', joined: '2024-08-22' },
  { id: 20, name: 'Marco Ríos', email: 'marco@example.com', phone: '+52 442 200 0020', city: 'Querétaro', status: 'active', totalSpent: 2749.96, orders: 13, lastOrder: '2024-07-25', joined: '2024-08-25' },
];

// ── Datos para gráficas del Dashboard ──────────────────────────────────────
export const salesData = [
  { month: 'Feb', sales: 42500, clientes: 38 },
  { month: 'Mar', sales: 56800, clientes: 52 },
  { month: 'Abr', sales: 48200, clientes: 44 },
  { month: 'May', sales: 71400, clientes: 68 },
  { month: 'Jun', sales: 63900, clientes: 61 },
  { month: 'Jul', sales: 89200, clientes: 85 },
];

export const clientStatusData = [
  { name: 'Activos', value: 75, color: '#10B981' },
  { name: 'Inactivos', value: 15, color: '#EF4444' },
  { name: 'Nuevos', value: 10, color: '#6366F1' },
];

export const clientGrowthData = [
  { month: 'Feb', clientes: 120 },
  { month: 'Mar', clientes: 185 },
  { month: 'Abr', clientes: 260 },
  { month: 'May', clientes: 390 },
  { month: 'Jun', clientes: 520 },
  { month: 'Jul', clientes: 680 },
];

export const topClientsData = [
  { name: 'Diego Jiménez', spent: 6449 },
  { name: 'Laura Hernández', spent: 4799 },
  { name: 'Alejandro Morales', spent: 3839 },
  { name: 'Jorge Rodríguez', spent: 3249 },
  { name: 'Natalia Vargas', spent: 3599 },
];

export const revenueByCity = [
  { city: 'CDMX', revenue: 24500 },
  { city: 'Guadalajara', revenue: 14200 },
  { city: 'Monterrey', revenue: 11800 },
  { city: 'Querétaro', revenue: 8900 },
  { city: 'Puebla', revenue: 7600 },
  { city: 'Otras', revenue: 22200 },
];
