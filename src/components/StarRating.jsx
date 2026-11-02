function StarRating({
  value = 0,
  onChange = null,
  size = 'md',
  showValue = false,
  count = null,
  label = 'Calificación',
}) {
  const stars = [1, 2, 3, 4, 5]
  const interactive = typeof onChange === 'function'
  const rounded = Math.round(Number(value) || 0)

  return (
    <span className={`star-rating star-rating-${size}`} aria-label={`${label}: ${value} de 5`}>
      <span className="star-rating-icons">
        {stars.map((star) => {
          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                className={`star-button${star <= rounded ? ' is-active' : ''}`}
                onClick={() => onChange(star)}
                aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                aria-pressed={star === rounded}
              >
                <i
                  className={`bi ${star <= rounded ? 'bi-star-fill' : 'bi-star'}`}
                  aria-hidden="true"
                />
              </button>
            )
          }

          const filled = Number(value) >= star
          const half = !filled && Number(value) >= star - 0.5

          return (
            <i
              key={star}
              className={`bi ${filled ? 'bi-star-fill' : half ? 'bi-star-half' : 'bi-star'}`}
              aria-hidden="true"
            />
          )
        })}
      </span>
      {showValue && (
        <span className="star-rating-value">
          {Number(value || 0).toFixed(1)}
          {count != null && <span className="star-rating-count"> ({count})</span>}
        </span>
      )}
    </span>
  )
}

export default StarRating
