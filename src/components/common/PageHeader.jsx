import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2} mb={3}>
      <Box>
        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.4}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Stack direction="row" gap={1.5} flexWrap="wrap">{actions}</Stack>}
    </Stack>
  );
}
