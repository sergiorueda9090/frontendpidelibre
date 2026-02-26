import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, Stack, alpha, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const MAX_MB = 5;

/**
 * ImageUploader — sube y previsualiza una imagen de perfil.
 *
 * Props:
 *   value      — File object | URL string | null
 *                  · File   → imagen recién seleccionada por el usuario
 *                  · string → URL de S3 existente (al editar un registro)
 *                  · null   → sin imagen
 *   onChange   — (File | null) => void
 *   readOnly   — solo muestra, sin controles de carga
 *   initials   — texto fallback cuando no hay imagen (ej. "ML")
 *   size       — diámetro en px (default 96)
 */
export default function ImageUploader({
  value,
  onChange,
  readOnly = false,
  initials = '',
  size = 96,
}) {
  const theme = useTheme();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  // Genera la URL de preview a partir del valor actual.
  // Si es un File → createObjectURL; si es string → úsala directamente.
  const [previewSrc, setPreviewSrc] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreviewSrc(null);
      return;
    }
    if (typeof value === 'string') {
      setPreviewSrc(value);
      return;
    }
    // value es un File object
    const url = URL.createObjectURL(value);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const primary = theme.palette.primary.main;
  const isDark = theme.palette.mode === 'dark';

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen supera ${MAX_MB} MB.`);
      return;
    }
    onChange(file);
  };

  const handleInputChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setError('');
    onChange(null);
  };

  /* ── Render ── */
  return (
    <Stack alignItems="center" gap={1}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Círculo principal */}
        <Box
          onClick={readOnly ? undefined : () => inputRef.current?.click()}
          onDrop={readOnly ? undefined : handleDrop}
          onDragOver={readOnly ? undefined : (e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={readOnly ? undefined : () => setDragging(false)}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: '2.5px dashed',
            borderColor: dragging
              ? primary
              : previewSrc
                ? alpha(primary, 0.35)
                : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
            overflow: 'hidden',
            cursor: readOnly ? 'default' : 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: previewSrc
              ? 'transparent'
              : dragging
                ? alpha(primary, 0.1)
                : isDark ? alpha('#fff', 0.04) : alpha(primary, 0.04),
            transition: 'all 0.2s ease',
            userSelect: 'none',
            '&:hover': readOnly ? {} : {
              borderColor: primary,
              bgcolor: alpha(primary, 0.07),
              '& .upload-hint': { opacity: 1 },
            },
          }}
        >
          {previewSrc ? (
            <>
              <img
                src={previewSrc}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {!readOnly && (
                <Box
                  className="upload-hint"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <CameraAltOutlinedIcon sx={{ color: '#fff', fontSize: size * 0.28 }} />
                </Box>
              )}
            </>
          ) : initials ? (
            <Typography
              sx={{
                fontSize: size * 0.32,
                fontWeight: 800,
                color: primary,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {initials}
            </Typography>
          ) : (
            <Stack alignItems="center" gap={0.5} sx={{ px: 1 }}>
              <AddPhotoAlternateOutlinedIcon
                sx={{ fontSize: size * 0.36, color: 'text.disabled' }}
              />
              {size >= 80 && (
                <Typography
                  variant="caption"
                  color="text.disabled"
                  textAlign="center"
                  lineHeight={1.2}
                  sx={{ fontSize: '0.6rem' }}
                >
                  Subir foto
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        {/* Badge cámara — cuando no hay imagen */}
        {!readOnly && !previewSrc && (
          <Box
            onClick={() => inputRef.current?.click()}
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: '50%',
              bgcolor: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${alpha(primary, 0.55)}`,
              border: `2px solid ${theme.palette.background.paper}`,
              transition: 'transform 0.18s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <CameraAltOutlinedIcon sx={{ fontSize: size * 0.15, color: '#fff' }} />
          </Box>
        )}

        {/* Botón quitar — cuando hay imagen */}
        {!readOnly && previewSrc && (
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 26,
              height: 26,
              bgcolor: theme.palette.error.main,
              color: '#fff',
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              transition: 'transform 0.18s ease, background-color 0.18s ease',
              '&:hover': {
                bgcolor: theme.palette.error.dark,
                transform: 'scale(1.1)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 13 }} />
          </IconButton>
        )}
      </Box>

      {/* Texto de ayuda / error */}
      {!readOnly && (
        <Typography
          variant="caption"
          textAlign="center"
          color={error ? 'error' : 'text.disabled'}
          lineHeight={1.4}
          sx={{ maxWidth: 160 }}
        >
          {error || (previewSrc ? 'Pasa el cursor para cambiar' : `JPG, PNG o WebP · Máx. ${MAX_MB} MB`)}
        </Typography>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
    </Stack>
  );
}
