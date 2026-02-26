import Swal from 'sweetalert2';

// ── Paleta del proyecto ────────────────────────────────────────────────────
const C = {
  primary : '#6366F1',
  success : '#22C55E',
  error   : '#EF4444',
  warning : '#F59E0B',
  info    : '#3B82F6',
  delete  : '#EF4444',
};

// ── CSS global inyectado una sola vez ──────────────────────────────────────
const CUSTOM_CSS = `
  .swal2-popup {
    font-family: 'Inter', 'Roboto', sans-serif !important;
    border-radius: 16px !important;
    padding: 2rem 2rem 1.75rem !important;
    box-shadow: 0 25px 60px rgba(0,0,0,0.18) !important;
  }
  .swal2-title {
    font-size: 1.2rem !important;
    font-weight: 800 !important;
    color: #111827 !important;
    margin-bottom: 0.2rem !important;
  }
  .swal2-html-container {
    font-size: 0.875rem !important;
    color: #6B7280 !important;
    margin-top: 0.25rem !important;
    line-height: 1.6 !important;
  }
  .swal2-icon {
    margin: 0 auto 1.25rem !important;
    border-width: 3px !important;
    width: 64px !important;
    height: 64px !important;
  }
  .swal2-icon .swal2-icon-content {
    font-size: 2rem !important;
  }
  .swal2-actions {
    gap: 0.75rem !important;
    margin-top: 1.5rem !important;
  }
  .swal2-confirm, .swal2-cancel {
    border-radius: 10px !important;
    font-weight: 700 !important;
    font-size: 0.875rem !important;
    padding: 0.6rem 1.5rem !important;
    letter-spacing: 0.01em !important;
    box-shadow: none !important;
    transition: filter 0.2s ease, transform 0.15s ease !important;
  }
  .swal2-confirm:hover,
  .swal2-cancel:hover {
    filter: brightness(1.1) !important;
    transform: translateY(-1px) !important;
  }
  .swal2-timer-progress-bar {
    border-radius: 0 0 16px 16px !important;
    height: 3px !important;
  }
  .swal2-popup.swal2-toast {
    border-radius: 12px !important;
    padding: 0.75rem 1.25rem !important;
    box-shadow: 0 8px 30px rgba(0,0,0,0.14) !important;
    gap: 0.6rem !important;
  }
  .swal2-popup.swal2-toast .swal2-title {
    font-size: 0.875rem !important;
    font-weight: 600 !important;
    color: #111827 !important;
  }
`;

function injectStyles() {
  if (!document.getElementById('swal-pidelibre-styles')) {
    const style = document.createElement('style');
    style.id = 'swal-pidelibre-styles';
    style.textContent = CUSTOM_CSS;
    document.head.appendChild(style);
  }
}

// ── Instancia base (modales centrados) ────────────────────────────────────
const Base = Swal.mixin({ didOpen: injectStyles });

// ── Instancia Toast (esquina superior derecha) ────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    injectStyles();
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});


// ══════════════════════════════════════════════════════════════════════════
//  TOASTS — notificaciones rápidas (no bloquean la UI)
// ══════════════════════════════════════════════════════════════════════════

/** Uso: alertCreated('Usuario') */
export function alertCreated(entity = 'Registro') {
  return Base.fire({
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    width: 400,
    html: `
      <div style="text-align:center; padding: 0.75rem 0 0.25rem;">
        <div style="
          width: 76px; height: 76px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08));
          border: 2px solid rgba(34,197,94,0.35);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 0 0 6px rgba(34,197,94,0.08);
        ">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7"
              stroke="#22C55E" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p style="font-size:1.2rem; font-weight:800; color:#111827; margin:0 0 0.4rem; line-height:1.3;">
          ¡${entity} creado!
        </p>
        <p style="font-size:0.875rem; color:#6B7280; margin:0; line-height:1.6;">
          El registro fue guardado correctamente<br/>en el sistema.
        </p>
      </div>
    `,
  });
}

/** Uso: alertUpdated('Usuario') */
export function alertUpdated(entity = 'Registro') {
  return Base.fire({
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    width: 400,
    html: `
      <div style="text-align:center; padding: 0.75rem 0 0.25rem;">
        <div style="
          width: 76px; height: 76px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08));
          border: 2px solid rgba(99,102,241,0.35);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 0 0 6px rgba(99,102,241,0.08);
        ">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p style="font-size:1.2rem; font-weight:800; color:#111827; margin:0 0 0.4rem; line-height:1.3;">
          ¡${entity} actualizado!
        </p>
        <p style="font-size:0.875rem; color:#6B7280; margin:0; line-height:1.6;">
          Los cambios fueron guardados correctamente<br/>en el sistema.
        </p>
      </div>
    `,
  });
}

/** Uso: alertDeleted('Usuario') */
export function alertDeleted(entity = 'Registro') {
  return Base.fire({
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    width: 400,
    html: `
      <div style="text-align:center; padding: 0.75rem 0 0.25rem;">
        <div style="
          width: 76px; height: 76px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08));
          border: 2px solid rgba(239,68,68,0.35);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 0 0 6px rgba(239,68,68,0.08);
        ">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p style="font-size:1.2rem; font-weight:800; color:#111827; margin:0 0 0.4rem; line-height:1.3;">
          ¡${entity} eliminado!
        </p>
        <p style="font-size:0.875rem; color:#6B7280; margin:0; line-height:1.6;">
          El registro fue eliminado correctamente<br/>del sistema.
        </p>
      </div>
    `,
  });
}

/** Uso: alertSuccess('Guardado', 'Los cambios se aplicaron.') */
export function alertSuccess(title = 'Operación exitosa', text = '') {
  return Toast.fire({ icon: 'success', title, text, iconColor: C.success });
}


// ══════════════════════════════════════════════════════════════════════════
//  MODALES — bloquean la UI hasta que el usuario responde
// ══════════════════════════════════════════════════════════════════════════

/** Uso: alertError('No se pudo guardar', 'Verifica tu conexión.') */
export function alertError(
  title = 'Ha ocurrido un error',
  text  = 'Inténtalo de nuevo más tarde.',
) {
  return Base.fire({
    icon: 'error',
    iconColor: C.error,
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: C.error,
  });
}

/** Uso: alertWarning('Sin permisos', 'No puedes editar esto.') */
export function alertWarning(title = 'Atención', text = '') {
  return Base.fire({
    icon: 'warning',
    iconColor: C.warning,
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: C.warning,
  });
}

/** Uso: alertInfo('Sesión próxima a expirar') */
export function alertInfo(title = 'Información', text = '') {
  return Base.fire({
    icon: 'info',
    iconColor: C.info,
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: C.info,
  });
}


// ══════════════════════════════════════════════════════════════════════════
//  CONFIRMACIONES — retornan Promise<boolean>
// ══════════════════════════════════════════════════════════════════════════

/**
 * Confirmación de eliminación (destructiva).
 *
 * Uso:
 *   const ok = await confirmDelete('Carlos Martínez');
 *   if (ok) dispatch(deleteUser(id));
 */
export async function confirmDelete(name = 'este registro') {
  const result = await Base.fire({
    icon: 'warning',
    iconColor: C.delete,
    title: '¿Eliminar registro?',
    html: `Esta acción <strong>no se puede deshacer</strong>.<br/>
           Se eliminará <strong>${name}</strong> permanentemente.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: C.delete,
    cancelButtonColor: '#9CA3AF',
    focusCancel: true,
    reverseButtons: true,
  });
  return result.isConfirmed;
}

/**
 * Confirmación genérica.
 *
 * Uso:
 *   const ok = await confirmAction('¿Publicar cambios?', 'Los usuarios lo verán de inmediato.');
 *   if (ok) publish();
 */
export async function confirmAction(
  title       = '¿Estás seguro?',
  text        = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
) {
  const result = await Base.fire({
    icon: 'question',
    iconColor: C.primary,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: C.primary,
    cancelButtonColor: '#9CA3AF',
    reverseButtons: true,
  });
  return result.isConfirmed;
}

/**
 * Confirmación de cambio de estado (activar / desactivar).
 *
 * Uso:
 *   const ok = await confirmToggle('Carlos Martínez', 'active');
 *   if (ok) dispatch(toggleUser(row));
 */
export async function confirmToggle(name = '', currentStatus = 'active') {
  const isActive   = currentStatus === 'active';
  const action     = isActive ? 'desactivar' : 'activar';
  const actionPast = isActive ? 'desactivado' : 'activado';
  const color      = isActive ? C.warning : C.success;

  const result = await Base.fire({
    icon: 'question',
    iconColor: color,
    title: `¿${isActive ? 'Desactivar' : 'Activar'} usuario?`,
    html: `<strong>${name}</strong> será ${actionPast} en el sistema.`,
    showCancelButton: true,
    confirmButtonText: `Sí, ${action}`,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: color,
    cancelButtonColor: '#9CA3AF',
    reverseButtons: true,
  });
  return result.isConfirmed;
}
