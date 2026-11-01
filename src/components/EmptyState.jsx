function EmptyState({ title = 'No encontramos productos', message, action }) {
  return (
    <div className="empty-state text-center py-5 px-3">
      <span className="empty-state-icon">
        <i className="bi bi-search" aria-hidden="true" />
      </span>
      <h2 className="h4 mt-3">{title}</h2>
      {message && <p className="text-secondary mb-3">{message}</p>}
      {action}
    </div>
  )
}

export default EmptyState
