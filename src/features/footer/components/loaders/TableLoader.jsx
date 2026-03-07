import React from 'react';
import { Box, CircularProgress, Fade, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

const ripple = keyframes`
  0%   { transform: scale(0.6); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0;   }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export default function FooterTableLoader({ visible }) {
  const theme   = useTheme();
  const primary = theme.palette.primary.main;
  const isDark  = theme.palette.mode === 'dark';

  return (
    <Fade in={visible} timeout={{ enter: 80, exit: 220 }} unmountOnExit>
      <Box
        sx={{
          position:       'absolute',
          inset:          0,
          zIndex:         20,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            2.5,
          backdropFilter: 'blur(6px)',
          bgcolor:        isDark
            ? alpha(theme.palette.background.default, 0.75)
            : alpha(theme.palette.background.paper,   0.78),
          borderRadius:   'inherit',
        }}
      >
        <Box
          sx={{
            position:        'relative',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            width:           80,
            height:          80,
          }}
        >
          <Box
            sx={{
              position:     'absolute',
              width:        52,
              height:       52,
              borderRadius: '50%',
              bgcolor:      alpha(primary, 0.3),
              animation:    `${ripple} 1.7s ease-out infinite`,
            }}
          />
          <Box
            sx={{
              position:        'absolute',
              width:           52,
              height:          52,
              borderRadius:    '50%',
              bgcolor:         alpha(primary, 0.22),
              animation:       `${ripple} 1.7s ease-out 0.55s infinite`,
            }}
          />
          <Box
            sx={{
              position:     'absolute',
              width:        68,
              height:       68,
              borderRadius: '50%',
              border:       `1.5px dashed ${alpha(primary, 0.35)}`,
              animation:    `${spin} 6s linear infinite`,
            }}
          />
          <Box
            sx={{
              width:          52,
              height:         52,
              borderRadius:   '50%',
              bgcolor:        alpha(primary, 0.1),
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      `0 0 0 2px ${alpha(primary, 0.2)}, 0 8px 28px ${alpha(primary, 0.28)}`,
            }}
          >
            <CircularProgress
              size={28}
              thickness={4.5}
              sx={{ color: primary }}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ color: 'text.primary', mb: 0.4, letterSpacing: '0.01em' }}
          >
            Cargando datos
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', letterSpacing: '0.03em' }}
          >
            Por favor espera un momento
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
