import React from 'react';
import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function SkeletonCard() {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Skeleton variant="rounded" width={48} height={48} />
          <Skeleton variant="text" width={60} height={16} />
        </Stack>
        <Skeleton variant="text" width="70%" height={36} />
        <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
      </CardContent>
    </Card>
  );
}
