import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box, Typography, IconButton, Chip, Stack, alpha, useTheme,
} from '@mui/material';
import CloseIcon              from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StarIcon               from '@mui/icons-material/Star';
import DragIndicatorIcon      from '@mui/icons-material/DragIndicator';

const MAX_MB    = 5;
const MAX_FILES = 10;

/**
 * ProductImageUploader — sube y organiza múltiples imágenes de producto.
 *
 * Props:
 *   images   — array de objetos { id, file (File|null), preview (string URL), isNew (bool) }
 *   onChange — (images[]) => void
 *   readOnly — solo muestra, sin controles
 */
export default function ProductImageUploader({ images = [], onChange, readOnly = false }) {
  const theme   = useTheme();
  const primary = theme.palette.primary.main;
  const isDark  = theme.palette.mode === 'dark';

  const [dropErrors, setDropErrors] = useState([]);
  const [dragIndex, setDragIndex]   = useState(null);
  const [overIndex, setOverIndex]   = useState(null);
  const dragNode                    = useRef(null);

  /* ── Dropzone ── */
  const onDrop = useCallback((accepted, rejected) => {
    const errs = rejected
      .map((r) => r.errors[0]?.message ?? 'Archivo inválido')
      .filter(Boolean);
    setDropErrors(errs);

    const remaining = MAX_FILES - images.length;
    if (remaining <= 0) return;

    const toAdd = accepted.slice(0, remaining).map((file) => ({
      id:      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      isNew:   true,
    }));

    onChange([...images, ...toAdd]);
  }, [images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize:  MAX_MB * 1024 * 1024,
    disabled: readOnly || images.length >= MAX_FILES,
    multiple: true,
  });

  /* ── Eliminar imagen ── */
  const handleRemove = (idx) => {
    const next = [...images];
    const [removed] = next.splice(idx, 1);
    if (removed.isNew && removed.preview) URL.revokeObjectURL(removed.preview);
    onChange(next);
  };

  /* ── Drag to reorder ── */
  const handleThumbnailDragStart = (e, idx) => {
    dragNode.current = e.currentTarget;
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleThumbnailDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overIndex !== idx) setOverIndex(idx);
  };

  const handleThumbnailDrop = (e, idx) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  /* ── Render ── */
  const canAddMore = !readOnly && images.length < MAX_FILES;

  return (
    <Stack gap={2}>

      {/* ── Dropzone ── */}
      {canAddMore && (
        <Box
          {...getRootProps()}
          sx={{
            border:       '2px dashed',
            borderColor:  isDragActive
              ? primary
              : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
            borderRadius: 2.5,
            p:            3,
            display:      'flex',
            flexDirection:'column',
            alignItems:   'center',
            gap:          1,
            cursor:       'pointer',
            bgcolor:      isDragActive ? alpha(primary, 0.07) : 'transparent',
            transition:   'all 0.2s ease',
            outline:      'none',
            '&:hover': {
              borderColor: primary,
              bgcolor:     alpha(primary, 0.05),
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 40, color: isDragActive ? primary : 'text.disabled' }}
          />
          <Typography
            variant="body2"
            color={isDragActive ? primary : 'text.secondary'}
            fontWeight={600}
            textAlign="center"
          >
            {isDragActive
              ? 'Suelta las imágenes aquí'
              : 'Arrastra imágenes o haz clic para seleccionar'}
          </Typography>
          <Typography variant="caption" color="text.disabled" textAlign="center">
            JPG, PNG o WebP · Máx. {MAX_MB} MB por imagen · Hasta {MAX_FILES} imágenes
            {images.length > 0 && ` · ${images.length}/${MAX_FILES} cargadas`}
          </Typography>
        </Box>
      )}

      {/* ── Errores ── */}
      {dropErrors.length > 0 && (
        <Typography variant="caption" color="error">
          {dropErrors.join(' · ')}
        </Typography>
      )}

      {/* ── Grid de miniaturas ── */}
      {images.length > 0 && (
        <>
          <Box
            sx={{
              display:               'grid',
              gridTemplateColumns:   'repeat(auto-fill, minmax(96px, 1fr))',
              gap:                   1.5,
            }}
          >
            {images.map((img, idx) => {
              const src    = img.preview ?? img.src ?? img;
              const isOver = overIndex === idx && dragIndex !== idx && dragIndex !== null;

              return (
                <Box
                  key={img.id ?? idx}
                  draggable={!readOnly}
                  onDragStart={(e) => handleThumbnailDragStart(e, idx)}
                  onDragOver={(e)  => handleThumbnailDragOver(e, idx)}
                  onDrop={(e)      => handleThumbnailDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    position:    'relative',
                    paddingTop:  '100%',  /* cuadrado */
                    borderRadius: 2,
                    border:       '2px solid',
                    borderColor:  isOver
                      ? primary
                      : idx === 0
                        ? alpha(primary, 0.55)
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    cursor:      readOnly ? 'default' : 'grab',
                    opacity:     dragIndex === idx ? 0.45 : 1,
                    transform:   isOver ? 'scale(1.04)' : 'scale(1)',
                    transition:  'all 0.15s ease',
                    boxShadow:   isOver
                      ? `0 0 0 3px ${alpha(primary, 0.35)}`
                      : idx === 0
                        ? `0 0 0 2px ${alpha(primary, 0.2)}`
                        : 'none',
                    '&:hover .remove-btn': { opacity: 1 },
                    '&:hover .drag-hint':  { opacity: 1 },
                  }}
                >
                  {/* Imagen */}
                  <Box
                    sx={{
                      position:     'absolute',
                      inset:        0,
                      borderRadius: 'inherit',
                      overflow:     'hidden',
                    }}
                  >
                    <img
                      src={src}
                      alt={`imagen-${idx + 1}`}
                      draggable={false}
                      style={{
                        width:      '100%',
                        height:     '100%',
                        objectFit:  'cover',
                        display:    'block',
                        userSelect: 'none',
                      }}
                    />
                  </Box>

                  {/* Hint de drag (ícono de arrastre) */}
                  {!readOnly && (
                    <Box
                      className="drag-hint"
                      sx={{
                        position:   'absolute',
                        top:        4,
                        left:       4,
                        opacity:    0,
                        transition: 'opacity 0.15s ease',
                        lineHeight: 0,
                      }}
                    >
                      <DragIndicatorIcon
                        sx={{
                          fontSize: 16,
                          color:    '#fff',
                          filter:   'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
                        }}
                      />
                    </Box>
                  )}

                  {/* Badge portada (primera imagen) */}
                  {idx === 0 && (
                    <Chip
                      label="Portada"
                      size="small"
                      icon={<StarIcon sx={{ fontSize: '11px !important' }} />}
                      sx={{
                        position:   'absolute',
                        bottom:     5,
                        left:       5,
                        height:     18,
                        fontSize:   '0.58rem',
                        fontWeight: 700,
                        bgcolor:    alpha(primary, 0.88),
                        color:      '#fff',
                        backdropFilter: 'blur(4px)',
                        '& .MuiChip-icon':  { color: '#fff' },
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}

                  {/* Botón eliminar */}
                  {!readOnly && (
                    <IconButton
                      size="small"
                      className="remove-btn"
                      onClick={() => handleRemove(idx)}
                      sx={{
                        position:   'absolute',
                        top:        -8,
                        right:      -8,
                        width:      22,
                        height:     22,
                        opacity:    0,
                        zIndex:     2,
                        bgcolor:    theme.palette.error.main,
                        color:      '#fff',
                        border:     `2px solid ${theme.palette.background.paper}`,
                        transition: 'opacity 0.15s ease, background-color 0.15s ease',
                        '&:hover': { bgcolor: theme.palette.error.dark, opacity: '1 !important' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 11 }} />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Hint de reorden */}
          {images.length > 1 && !readOnly && (
            <Typography variant="caption" color="text.disabled" textAlign="center">
              Arrastra las miniaturas para reordenar · La primera imagen es la portada
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
}
