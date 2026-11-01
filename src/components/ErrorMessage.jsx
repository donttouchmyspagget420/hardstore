function ErrorMessage({ message, onRetry, title = 'No se pudieron cargar los datos' }) {
  return (
    <div className="alert alert-danger d-flex flex-column flex-md-row align-items-md-center gap-3 shadow-sm" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-3 lh-1" aria-hidden="true" />
      <div className="flex-grow-1">
        <strong className="d-block mb-1">{title}</strong>
        <p className="mb-0 small">{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
