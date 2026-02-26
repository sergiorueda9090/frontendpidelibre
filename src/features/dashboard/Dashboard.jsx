import React from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Avatar, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import {
  salesData, clientStatusData, clientGrowthData, topClientsData,
  mockClients,
} from '../../utils/mockData';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getInitials } from '../../utils/formatters';

const STAT_CARDS = [
  {
    title: 'Ingresos totales',
    value: formatCurrency(372000),
    icon: <AttachMoneyIcon />,
    trend: 18,
    trendLabel: 'vs mes anterior',
    color: '#6366F1',
  },
  {
    title: 'Clientes activos',
    value: '680',
    icon: <PersonIcon />,
    trend: 12,
    trendLabel: 'nuevos este mes',
    color: '#10B981',
  },
  {
    title: 'Usuarios del panel',
    value: '5',
    icon: <PeopleIcon />,
    trend: 0,
    trendLabel: '2 administradores',
    color: '#F59E0B',
  },
  {
    title: 'Ticket promedio',
    value: formatCurrency(1862),
    icon: <TrendingUpIcon />,
    trend: 6,
    trendLabel: 'por cliente',
    color: '#EC4899',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={0.5}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Typography key={p.dataKey} variant="body2" sx={{ color: p.color }} fontWeight={600}>
          {p.name}:{' '}
          {p.name.toLowerCase().includes('ingreso') ? formatCurrency(p.value) : p.value}
        </Typography>
      ))}
    </Paper>
  );
};

const recentClients = [...mockClients]
  .sort((a, b) => new Date(b.joined) - new Date(a.joined))
  .slice(0, 8);

export default function Dashboard() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const SECONDARY = theme.palette.secondary.main;
  const SUCCESS = theme.palette.success.main;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Bienvenido de vuelta, Carlos. Aquí está el resumen de hoy."
      />

      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 3,
        }}
      >
        {STAT_CARDS.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </Box>

      {/* Row 1: Ingresos + Estado de clientes */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        {/* Area chart — ingresos */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Ingresos mensuales</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Evolución de ingresos y clientes nuevos
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clientsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={SUCCESS} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  width={62}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Ingresos ($)"
                  stroke={PRIMARY}
                  fill="url(#salesGrad)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie — estado de clientes */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Estado de clientes</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Distribución actual
            </Typography>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={clientStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {clientStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <Stack gap={0.75} mt={1}>
              {clientStatusData.map((item) => (
                <Stack key={item.name} direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" color="text.secondary">{item.name}</Typography>
                  </Stack>
                  <Typography variant="caption" fontWeight={700}>{item.value}%</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Row 2: Crecimiento clientes + Top clientes */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        {/* Line chart — crecimiento */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Crecimiento de clientes</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Clientes acumulados por mes
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={clientGrowthData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="clientes"
                  name="Clientes"
                  stroke={SECONDARY}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: SECONDARY }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar chart — top clientes */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Top clientes por gasto</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Clientes con mayor volumen de compra
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topClientsData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="spent" name="Gasto total" fill={SUCCESS} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Clientes recientes */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Clientes registrados recientemente</Typography>
          <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell align="right">Total gastado</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell>Registro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1.25}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'primary.main' }}>
                          {getInitials(client.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                            {client.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {client.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{client.city}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {formatCurrency(client.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(client.status)}
                        color={getStatusColor(client.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(client.joined)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}
