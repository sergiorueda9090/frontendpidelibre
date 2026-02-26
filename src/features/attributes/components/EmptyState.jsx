import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyState({ title = 'Sin resultados', description = 'No se encontraron elementos.', actionLabel, onAction, icon: Icon = InboxIcon }) {
  return (
    <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <Icon sx={{ fontSize: 36, color: 'text.disabled' }} />
      </Box>
      <Typography variant="h6" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={320}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
