import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, Tooltip,
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import TuneIcon from '@mui/icons-material/Tune';
import { useThemeSettings } from '../../theme/ThemeContext';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED = 72;

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard',   path: '/dashboard',  icon: <DashboardIcon /> },
      { label: 'Usuarios',    path: '/usuarios',   icon: <PeopleIcon /> },
      { label: 'Clientes',    path: '/clientes',   icon: <PersonIcon /> },
      { label: 'Categorías',  path: '/categorias', icon: <CategoryIcon /> },
      { label: 'Atributos',   path: '/atributos',  icon: <TuneIcon /> },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Personalización', path: '/personalizacion', icon: <PaletteIcon /> },
    ],
  },
];

function NavItem({ item, collapsed }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
      <ListItem disablePadding sx={{ mb: 0.25 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          sx={{
            mx: 1,
            borderRadius: 1.5,
            minHeight: 44,
            px: collapsed ? 1.5 : 1.75,
            justifyContent: collapsed ? 'center' : 'flex-start',
            bgcolor: isActive ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
            color: isActive ? 'primary.main' : 'rgba(255,255,255,0.65)',
            '&:hover': {
              bgcolor: isActive ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255,255,255,0.06)',
              color: isActive ? 'primary.main' : 'rgba(255,255,255,0.9)',
            },
            transition: 'all 0.15s',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 36,
              color: 'inherit',
              justifyContent: 'center',
              '& .MuiSvgIcon-root': { fontSize: 20 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
          )}
          {isActive && !collapsed && (
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}

function SidebarContent({ collapsed }) {
  const { settings } = useThemeSettings();

  return (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: settings.mode === 'dark' ? '#0F172A' : '#111827',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1.5,
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <StorefrontIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#fff" lineHeight={1.1} noWrap>
              pidelibre
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
              Admin Panel
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 1.5 }} />

      {/* Navigation */}
      <Box
        sx={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
        }}
      >
        {NAV_GROUPS.map((group) => (
          <Box key={group.label} sx={{ mb: 1 }}>
            {!collapsed ? (
              <Typography
                variant="overline"
                sx={{
                  px: 2.5, color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.65rem', letterSpacing: '0.1em',
                  display: 'block', mb: 0.5,
                }}
              >
                {group.label}
              </Typography>
            ) : (
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.07)', mx: 1.5 }} />
            )}
            <List disablePadding>
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} />
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 1.5 }} />

      {/* User info */}
      {!collapsed ? (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 34, height: 34, bgcolor: 'primary.main',
              fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
            }}
          >
            CM
          </Avatar>
          <Box flex={1} overflow="hidden">
            <Typography variant="body2" fontWeight={600} color="#fff" noWrap>
              Carlos Martínez
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block' }} noWrap>
              Administrador
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 700 }}>
            CM
          </Avatar>
        </Box>
      )}
    </Box>
  );
}

export default function Sidebar({ open, onClose, isMobile }) {
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: SIDEBAR_WIDTH, border: 0 } }}
      >
        <SidebarContent collapsed={false} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
          border: 0,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <SidebarContent collapsed={!open} />
    </Drawer>
  );
}
