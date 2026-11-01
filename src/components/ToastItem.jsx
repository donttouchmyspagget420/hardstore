import { useEffect } from 'react'

const ICONS = {
  success: 'bi-check-circle-fill',
  danger: 'bi-exclamation-octagon-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

const DURATION = 4500

function ToastItem({ toast, onClose }) {
  const variant = ICONS[toast.variant] ? toast.variant : 'info'
  const darkCloseButton = variant === 'warning' || variant === 'info'

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), DURATION)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <div
      className={`toast show text-bg-${variant} border-0 shadow`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body d-flex align-items-start gap-2">
          <i className={`bi ${ICONS[variant]} fs-5 lh-1`} aria-hidden="true" />
          <div>
            {toast.title && <strong className="d-block mb-1">{toast.title}</strong>}
            <span>{toast.message}</span>
          </div>
        </div>
        <button
          type="button"
          className={`btn-close ${darkCloseButton ? '' : 'btn-close-white'} me-2 mt-2`}
          onClick={() => onClose(toast.id)}
          aria-label="Cerrar notificación"
        />
      </div>
    </div>
  )
}

export default ToastItem
