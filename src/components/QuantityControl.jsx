function QuantityControl({ value, min = 1, max = 99, onChange, disabled = false, size = 'md' }) {
  const safeMax = Math.max(min, Number(max) || min)
  const current = Math.min(safeMax, Math.max(min, Number(value) || min))

  const change = (next) => {
    if (disabled) return
    onChange?.(Math.min(safeMax, Math.max(min, next)))
  }

  return (
    <div className={`quantity-control quantity-control-${size}`} role="group" aria-label="Cantidad">
      <button
        type="button"
        className="btn quantity-btn"
        onClick={() => change(current - 1)}
        disabled={disabled || current <= min}
        aria-label="Quitar una unidad"
      >
        <i className="bi bi-dash-lg" aria-hidden="true" />
      </button>
      <input
        type="number"
        className="quantity-input"
        value={current}
        min={min}
        max={safeMax}
        onChange={(event) => {
          const parsed = Number(event.target.value)
          if (!Number.isNaN(parsed)) change(parsed)
        }}
        disabled={disabled}
        aria-label="Cantidad seleccionada"
      />
      <button
        type="button"
        className="btn quantity-btn"
        onClick={() => change(current + 1)}
        disabled={disabled || current >= safeMax}
        aria-label="Agregar una unidad"
      >
        <i className="bi bi-plus-lg" aria-hidden="true" />
      </button>
    </div>
  )
}

export default QuantityControl
