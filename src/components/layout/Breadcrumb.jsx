import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const ROUTE_LABELS = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  clientes: 'Clientes',
  personalizacion: 'Personalización',
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Box sx={{ mb: 0.5 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
        sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          color="text.secondary"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}
        >
          <HomeIcon sx={{ fontSize: 14 }} />
          Inicio
        </Link>
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const label = ROUTE_LABELS[seg] || seg;
          return isLast ? (
            <Typography key={seg} variant="body2" color="text.primary" fontWeight={600} fontSize="0.8rem">
              {label}
            </Typography>
          ) : (
            <Link
              key={seg}
              component={RouterLink}
              to={'/' + segments.slice(0, idx + 1).join('/')}
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: '0.8rem' }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
