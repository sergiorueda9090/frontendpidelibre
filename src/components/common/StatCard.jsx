import React from 'react';
import { Card, CardContent, Box, Typography, Stack, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({ title, value, icon, trend, trendLabel, color = 'primary.main' }) {
  const isPositive = trend >= 0;

  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              width: 52, height: 52, borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: `${color}18`, color,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Chip
              size="small"
              icon={isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              label={`${isPositive ? '+' : ''}${trend}%`}
              color={isPositive ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.72rem' }}
            />
          )}
        </Stack>

        <Typography variant="h4" fontWeight={800} lineHeight={1.1} mb={0.5}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        {trendLabel && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
            {trendLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
