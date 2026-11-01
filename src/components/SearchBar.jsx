function SearchBar({ value, onChange, placeholder = 'Buscar productos...', id = 'product-search' }) {
  return (
    <div className="input-group search-group">
      <span className="input-group-text bg-white" aria-hidden="true">
        <i className="bi bi-search" />
      </span>
      <input
        id={id}
        type="search"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
