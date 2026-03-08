import React from 'react';
import { Box, CircularProgress, Fade, Typography } from '@mui/material';

export default function GlobalLoader({ message = 'Cargando...' }) {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: 'background.default', gap: 2,
        }}
      >
        <CircularProgress size={48} thickness={3} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {message}
        </Typography>
      </Box>
    </Fade>
  );
}
