import { Link } from 'react-router-dom'
import { DEFAULT_IMAGE } from '../data/categories'
import { formatCurrency, getStockState } from '../utils/format'

function ProductCard({ product, showAdminActions = false, onEdit, onDelete }) {
  const stock = getStockState(product.stock)

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = DEFAULT_IMAGE
  }

  return (
    <article className="card product-card h-100 border-0 shadow-sm">
      <Link to={`/productos/${product.id}`} className="product-card-media" aria-label={`Ver detalle de ${product.name}`}>
        <img
          src={product.image || DEFAULT_IMAGE}
          alt={product.name}
          className="card-img-top product-card-image"
          loading="lazy"
          onError={handleImageError}
        />
        <span className="badge category-badge">{product.category}</span>
      </Link>

      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title mb-1">
          <Link className="product-card-title" to={`/productos/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        <p className="card-text text-secondary product-card-description flex-grow-1">
          {product.description}
        </p>

        <div className="d-flex align-items-end justify-content-between gap-2 mt-2">
          <span className="product-price">{formatCurrency(product.price)}</span>
          <span className={`badge ${stock.badge} stock-badge`}>{stock.label}</span>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Link className="btn btn-dark btn-sm flex-grow-1" to={`/productos/${product.id}`}>
            Ver detalle
            <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
          </Link>

          {showAdminActions && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onEdit?.(product)}
                aria-label={`Editar ${product.name}`}
                title="Editar producto"
              >
                <i className="bi bi-pencil-square" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete?.(product)}
                aria-label={`Eliminar ${product.name}`}
                title="Eliminar producto"
              >
                <i className="bi bi-trash3" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
