import { useEffect } from 'react'

function ConfirmModal({
  show,
  title = 'Confirmar eliminación',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!show) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [show, loading, onCancel])

  if (!show) return null

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={() => {
          if (!loading) onCancel()
        }}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(event) => event.stopPropagation()}>
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <h2 className="modal-title h5 d-flex align-items-center gap-2" id="confirm-modal-title">
                <span className="confirm-icon">
                  <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
                </span>
                {title}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onCancel}
                disabled={loading}
              />
            </div>
            <div className="modal-body text-secondary">{message}</div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </button>
              <button type="button" className={`btn btn-${variant}`} onClick={onConfirm} disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  )
}

export default ConfirmModal
