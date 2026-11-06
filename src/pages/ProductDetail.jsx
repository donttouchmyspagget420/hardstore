import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { useToast } from '../context/toast-context'
import { productApi } from '../services/api'
import { formatCurrency, getStockState } from '../utils/format'
import { DEFAULT_IMAGE } from '../utils/constants'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import QuantityControl from '../components/QuantityControl'
import ReviewsSection from '../components/ReviewsSection'

function ProductDetailView({ id }) {
  const { product, loading, error, refetch } = useProduct(id)
  const { isAdmin, isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productApi.remove(product.id)
      showToast(`"${product.name}" se eliminó del catálogo.`, 'success', 'Producto eliminado')
      navigate('/productos')
    } catch (deleteError) {
      showToast(deleteError.message, 'danger', 'No se pudo eliminar')
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <Loader label="Cargando detalle del producto..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <ErrorMessage
          title={error?.includes('no existe') ? 'Producto no encontrado' : 'No se pudo cargar el producto'}
          message={error || 'El producto solicitado no está disponible.'}
          onRetry={refetch}
        />
        <Link className="btn btn-outline-dark mt-3" to="/productos">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const stock = getStockState(product.stock)
  const stockNumber = Math.max(0, Number(product.stock) || 0)
  const isOutOfStock = stockNumber <= 0
  const highlights = Array.isArray(product.highlights) ? product.highlights : []
  const specs = product.specs && typeof product.specs === 'object' ? Object.entries(product.specs) : []
  const descriptionParagraphs = String(product.longDescription || product.description || '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = DEFAULT_IMAGE
  }

  const handleAddToCart = () => {
    const result = addItem(product, quantity)

    if (result.ok) {
      showToast(
        `${quantity} × ${product.name} se agregó al carrito.`,
        'success',
        'Producto agregado',
      )
      return
    }

    if (result.reason === 'out-of-stock') {
      showToast('Este producto no tiene stock disponible.', 'danger', 'Sin stock')
      return
    }

    showToast(
      `Ya tenés ${result.quantity} unidades en el carrito, el máximo disponible.`,
      'warning',
      'Stock máximo',
    )
  }

  return (
    <>
      <div className="container py-4 py-lg-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/productos">Productos</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-6">
            <div className="detail-image-wrap">
              <img
                src={product.image || DEFAULT_IMAGE}
                alt={product.name}
                className="detail-image"
                onError={handleImageError}
              />
              {product.featured && (
                <span className="badge featured-badge detail-featured">
                  <i className="bi bi-star-fill me-1" aria-hidden="true" />
                  Producto destacado
                </span>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="badge text-bg-dark px-3 py-2">{product.category}</span>
              <span className={`badge ${stock.badge} px-3 py-2`}>{stock.label}</span>
              {product.brand && <span className="badge badge-soft px-3 py-2">{product.brand}</span>}
            </div>

            <h1 className="display-6 fw-bold mb-2">{product.name}</h1>
            <p className="text-secondary mb-3">{product.description}</p>

            <a className="detail-reviews-link" href="#opiniones">
              <i className="bi bi-chat-square-text me-1" aria-hidden="true" />
              Ver opiniones de la comunidad
              <i className="bi bi-arrow-down ms-1" aria-hidden="true" />
            </a>

            <div className="detail-price my-4">{formatCurrency(product.price)}</div>

            {highlights.length > 0 && (
              <ul className="detail-highlights mb-4">
                {highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`}>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            <div className="detail-meta row g-3 mb-4">
              <div className="col-6">
                <span className="detail-meta-label">Marca</span>
                <strong>{product.brand || 'HardStore'}</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Stock disponible</span>
                <strong>{stockNumber} unidades</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Código</span>
                <strong>{product.sku || `HS-${String(product.id).padStart(4, '0')}`}</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Garantía</span>
                <strong>{product.warranty || '12 meses'}</strong>
              </div>
            </div>

            <div className="detail-buy-box">
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <span className="detail-meta-label mb-0">Cantidad</span>
                <QuantityControl
                  value={quantity}
                  min={1}
                  max={Math.max(1, stockNumber)}
                  onChange={setQuantity}
                  disabled={isOutOfStock}
                />
                <span className="small text-secondary">Máximo {stockNumber} unidades</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-brand btn-lg flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <i className="bi bi-cart-plus me-2" aria-hidden="true" />
                  {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                </button>
                <Link className="btn btn-outline-dark btn-lg" to="/carrito">
                  <i className="bi bi-bag me-2" aria-hidden="true" />
                  Ver carrito
                </Link>
              </div>

              {!isAuthenticated && (
                <p className="small text-secondary mb-0 mt-3">
                  <i className="bi bi-info-circle me-1" aria-hidden="true" />
                  Podés agregar productos sin iniciar sesión. Para finalizar la compra necesitás una
                  cuenta.
                </p>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link className="btn btn-outline-secondary" to="/productos">
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Volver al catálogo
              </Link>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => navigate(`/admin?edit=${product.id}`)}
                  >
                    <i className="bi bi-pencil-square me-2" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <i className="bi bi-trash3 me-2" aria-hidden="true" />
                    Eliminar
                  </button>
                </>
              )}
            </div>

            {isAdmin && (
              <div className="alert alert-warning d-flex align-items-start gap-2 mb-0 mt-3" role="status">
                <i className="bi bi-shield-check fs-5" aria-hidden="true" />
                <div className="small">
                  Estás viendo el producto como <strong>administrador</strong>. Podés modificarlo o
                  eliminarlo desde este detalle.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="row g-4 mt-4 mt-lg-5">
          <div className="col-lg-7">
            <section className="info-card card border-0 shadow-sm h-100">
              <div className="card-body p-4 p-lg-5">
                <span className="section-kicker">Descripción completa</span>
                <h2 className="h3 mt-1 mb-3">Conocé el producto en detalle</h2>
                {descriptionParagraphs.map((paragraph, index) => (
                  <p className="text-secondary" key={`${paragraph.slice(0, 24)}-${index}`}>
                    {paragraph}
                  </p>
                ))}
                <div className="detail-assurance">
                  <div>
                    <i className="bi bi-truck" aria-hidden="true" />
                    <span>Envío en 24-48 hs</span>
                  </div>
                  <div>
                    <i className="bi bi-shield-check" aria-hidden="true" />
                    <span>Garantía {product.warranty || '12 meses'}</span>
                  </div>
                  <div>
                    <i className="bi bi-arrow-repeat" aria-hidden="true" />
                    <span>Devolución en 30 días</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="col-lg-5">
            <section className="info-card card border-0 shadow-sm h-100">
              <div className="card-body p-4 p-lg-5">
                <span className="section-kicker">Ficha técnica</span>
                <h2 className="h3 mt-1 mb-3">Especificaciones</h2>

                {specs.length > 0 ? (
                  <dl className="spec-list mb-0">
                    {specs.map(([key, value]) => (
                      <div className="spec-row" key={key}>
                        <dt>{key}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-secondary mb-0">
                    Este producto todavía no tiene especificaciones ampliadas cargadas.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <ReviewsSection productId={product.id} productName={product.name} />
      </div>

      <ConfirmModal
        show={confirmOpen}
        title="Eliminar producto"
        message={
          <>
            ¿Seguro que querés eliminar <strong>{product.name}</strong>? Esta acción no se puede
            deshacer y el producto desaparecerá del catálogo.
          </>
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

function ProductDetail() {
  const { id } = useParams()

  // La key fuerza el remontaje al navegar entre productos, evitando datos previos.
  return <ProductDetailView key={id} id={id} />
}

export default ProductDetail
