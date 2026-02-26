import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED = 72;

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggle = () => setSidebarOpen((v) => !v);
  const contentMargin = isMobile ? 0 : sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: isMobile ? 0 : `${contentMargin}px`,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggle}
          isMobile={isMobile}
        />

        {/* Content area */}
        <Box sx={{ flex: 1, pt: '64px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
            <Breadcrumb />
            <Box sx={{ mt: 1.5 }}>
              <Outlet />
            </Box>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
