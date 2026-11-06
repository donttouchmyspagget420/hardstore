import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { useStore } from '../context/store-context'
import { DEFAULT_IMAGE } from '../utils/constants'
import { formatCurrency } from '../utils/format'
import QuantityControl from '../components/QuantityControl'
import EmptyState from '../components/EmptyState'

function Cart() {
  const { items, updateQuantity, removeItem, subtotal, shipping, total, missingForFreeShipping } =
    useCart()
  const { isAuthenticated } = useAuth()
  const { settings } = useStore()
  const freeThreshold = Number(settings?.shipping?.freeThreshold) || 0

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = DEFAULT_IMAGE
  }

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <EmptyState
              title="Tu carrito está vacío"
              message="Todavía no agregaste productos. Explorá el catálogo y encontrá el hardware que necesitás."
              action={
                <Link className="btn btn-brand" to="/productos">
                  <i className="bi bi-grid me-1" aria-hidden="true" />
                  Ver catálogo
                </Link>
              }
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Carrito
              </li>
            </ol>
          </nav>
          <span className="section-kicker text-brand">Tu compra</span>
          <h1 className="display-5 fw-bold text-white mb-2">Carrito de compras</h1>
          <p className="text-white-50 mb-0">
            Revisá los productos, ajustá las cantidades y continuá al pago cuando estés listo.
          </p>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm cart-list">
              <div className="card-body p-0">
                {items.map((item) => (
                  <article className="cart-item" key={item.productId}>
                    <Link to={`/productos/${item.productId}`} className="cart-item-media">
                      <img
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </Link>

                    <div className="cart-item-body">
                      <div className="d-flex flex-wrap align-items-start justify-content-between gap-2">
                        <div>
                          {item.brand && <span className="product-brand">{item.brand}</span>}
                          <h2 className="h6 mb-1">
                            <Link className="product-card-title" to={`/productos/${item.productId}`}>
                              {item.name}
                            </Link>
                          </h2>
                          <span className="badge badge-soft">{item.category}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Quitar ${item.name} del carrito`}
                        >
                          <i className="bi bi-trash3 me-1" aria-hidden="true" />
                          Quitar
                        </button>
                      </div>

                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
                        <div className="d-flex align-items-center gap-3">
                          <QuantityControl
                            value={item.quantity}
                            min={1}
                            max={Math.max(1, item.stock)}
                            onChange={(quantity) => updateQuantity(item.productId, quantity)}
                            size="sm"
                          />
                          <span className="small text-secondary">
                            {formatCurrency(item.price)} c/u
                          </span>
                        </div>
                        <strong className="cart-line-total">
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-between gap-2 mt-3">
              <Link className="btn btn-outline-dark" to="/productos">
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Seguir comprando
              </Link>
              <span className="small text-secondary align-self-center">
                <i className="bi bi-shield-check me-1" aria-hidden="true" />
                Compra protegida y datos de pago simulados
              </span>
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="card border-0 shadow-sm cart-summary sticky-lg-top">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Resumen de compra</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <strong>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</strong>
                </div>

                {shipping > 0 && freeThreshold > 0 && (
                  <div className="shipping-progress mt-3">
                    <p className="small text-secondary mb-1">
                      Agregá {formatCurrency(missingForFreeShipping)} más para obtener envío gratis.
                    </p>
                    <div className="progress" role="progressbar" aria-label="Progreso hacia el envío gratis" aria-valuenow={Math.round((subtotal / freeThreshold) * 100)} aria-valuemin="0" aria-valuemax="100">
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <hr />

                <div className="summary-row summary-total">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>

                <Link
                  className="btn btn-brand btn-lg w-100 mt-3"
                  to={isAuthenticated ? '/checkout' : '/login'}
                  state={isAuthenticated ? undefined : { from: { pathname: '/checkout' } }}
                >
                  <i className="bi bi-credit-card me-2" aria-hidden="true" />
                  Finalizar compra
                </Link>

                {!isAuthenticated && (
                  <p className="small text-secondary text-center mt-2 mb-0">
                    Iniciá sesión para completar el pago.
                  </p>
                )}

                <div className="cart-payment-note">
                  <i className="bi bi-lock" aria-hidden="true" />
                  <span>No guardamos números de tarjeta completos ni códigos de seguridad.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
