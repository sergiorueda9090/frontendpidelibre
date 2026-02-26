import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Stack, Avatar,
  Badge, Menu, MenuItem, Divider, Box, Tooltip,
  ListItemIcon, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeSettings } from '../../theme/ThemeContext';
import { getInitials } from '../../utils/formatters';
import { doLogout } from '../../store/authStore/authThunks';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED = 72;

export default function Navbar({ sidebarOpen, onToggleSidebar, isMobile }) {
  const { settings, updateSettings } = useThemeSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user     = useSelector((s) => s.authStore.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const marginLeft = isMobile ? 0 : sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: `${marginLeft}px`,
        width: isMobile ? '100%' : `calc(100% - ${marginLeft}px)`,
        transition: 'margin-left 0.3s, width 0.3s',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '64px !important' }}>
        <IconButton onClick={onToggleSidebar} edge="start" sx={{ color: 'text.secondary' }}>
          {sidebarOpen && !isMobile ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>

        <Box flex={1} />

        <Stack direction="row" alignItems="center" gap={0.5}>
          {/* Dark mode toggle */}
          <Tooltip title={settings.mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            <IconButton
              onClick={() => updateSettings({ mode: settings.mode === 'dark' ? 'light' : 'dark' })}
              sx={{ color: 'text.secondary' }}
            >
              {settings.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notificaciones">
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)} sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            PaperProps={{ sx: { minWidth: 300, borderRadius: 2, mt: 1 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>Notificaciones</Typography>
            </Box>
            <Divider />
            {['Nueva orden ORD-0025 recibida', '3 productos con stock bajo', 'Diego Jiménez realizó una compra', 'Reporte mensual disponible'].map((msg, i) => (
              <MenuItem key={i} onClick={() => setNotifAnchor(null)} sx={{ py: 1.5, gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2">{msg}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* User menu */}
          <Tooltip title="Mi cuenta">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                {getInitials(user?.full_name ?? user?.username ?? 'U')}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { minWidth: 220, borderRadius: 2, mt: 1 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.full_name ?? user?.username}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email ?? ''}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/configuracion'); setAnchorEl(null); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Configuración</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/personalizacion'); setAnchorEl(null); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Personalización</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => { setAnchorEl(null); dispatch(doLogout(navigate)); }}
            >
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText>Cerrar sesión</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
