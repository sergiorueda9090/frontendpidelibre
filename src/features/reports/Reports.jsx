import React from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import PageHeader from '../../components/common/PageHeader';
import { salesData, orderStatusData, userGrowthData, categoryRevenueData } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ p: 1.5, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
      {payload.map((p) => (
        <Typography key={p.dataKey} variant="body2" sx={{ color: p.color }} fontWeight={600}>
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('ingreso') ? formatCurrency(p.value) : p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function Reports() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const SECONDARY = theme.palette.secondary.main;
  const SUCCESS = theme.palette.success.main;
  const WARNING = theme.palette.warning.main;

  const totalRevenue = salesData.reduce((s, d) => s + d.sales, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const avgOrder = totalRevenue / totalOrders;

  return (
    <Box>
      <PageHeader title="Reportes" subtitle="Análisis de rendimiento y métricas del período" />

      {/* Summary chips */}
      <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
        <Chip label={`Ingresos: ${formatCurrency(totalRevenue)}`} color="primary" variant="outlined" />
        <Chip label={`Órdenes: ${totalOrders}`} color="success" variant="outlined" />
        <Chip label={`Ticket promedio: ${formatCurrency(avgOrder)}`} color="secondary" variant="outlined" />
      </Stack>

      {/* Row 1 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, gap: 2.5, mb: 2.5 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Ingresos y órdenes mensuales</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Últimos 6 meses comparativa</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="sales" name="Ingresos ($)" stroke={PRIMARY} fill="url(#rSalesGrad)" strokeWidth={2.5} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Órdenes" stroke={SUCCESS} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Estado de órdenes</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Distribución porcentual</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <Stack gap={0.75} mt={1}>
              {orderStatusData.map((item) => (
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

      {/* Row 2 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Ingresos por categoría</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Ventas acumuladas por categoría</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryRevenueData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" name="Ingresos" fill={SECONDARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={0.5}>Crecimiento de usuarios</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Usuarios acumulados por mes</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowthData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="Usuarios" stroke={WARNING} strokeWidth={2.5} dot={{ r: 4, fill: WARNING }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
