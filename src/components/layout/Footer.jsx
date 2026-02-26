import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto', py: 2, px: 3,
        borderTop: 1, borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="caption" color="text.disabled">
          © {new Date().getFullYear()} pidelibre.com — Todos los derechos reservados.
        </Typography>
        <Stack direction="row" gap={2}>
          <Link variant="caption" href="#" color="text.disabled" underline="hover">Términos</Link>
          <Link variant="caption" href="#" color="text.disabled" underline="hover">Privacidad</Link>
          <Link variant="caption" href="#" color="text.disabled" underline="hover">Soporte</Link>
        </Stack>
      </Stack>
    </Box>
  );
}
