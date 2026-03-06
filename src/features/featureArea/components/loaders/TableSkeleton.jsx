import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Skeleton, Paper, alpha, useTheme,
} from '@mui/material';

export default function TableSkeleton({ columns = 5, rows = 8 }) {
  const theme = useTheme();
  const headerBg = theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.15)
    : alpha(theme.palette.primary.main, 0.06);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 1px 12px rgba(0,0,0,0.35)'
          : '0 1px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: headerBg }}>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i} sx={{ py: 1.5, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                <Skeleton variant="text" width="55%" height={14} sx={{ borderRadius: 1 }} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <TableRow key={rIdx}>
              {Array.from({ length: columns }).map((_, cIdx) => (
                <TableCell key={cIdx} sx={{ py: 1.25, borderColor: theme.palette.divider }}>
                  <Skeleton variant="text" width={cIdx === 0 ? '40%' : '70%'} height={18} sx={{ borderRadius: 1 }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
