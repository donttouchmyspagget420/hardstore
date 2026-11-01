function Loader({ label = 'Cargando productos...', compact = false }) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center text-secondary ${
        compact ? 'py-4' : 'py-5'
      }`}
      role="status"
    >
      <div className="spinner-border text-brand" aria-hidden="true" />
      <p className="mt-3 mb-0 small">{label}</p>
      <span className="visually-hidden">{label}</span>
    </div>
  )
}

export default Loader
