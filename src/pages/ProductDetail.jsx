import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { productApi } from '../services/api'
import { formatCurrency, getStockState } from '../utils/format'
import { DEFAULT_IMAGE } from '../data/categories'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'

function ProductDetailView({ id }) {
  const { product, loading, error, refetch } = useProduct(id)
  const { isAdmin } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = DEFAULT_IMAGE
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
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="badge text-bg-dark px-3 py-2">{product.category}</span>
              <span className={`badge ${stock.badge} px-3 py-2`}>{stock.label}</span>
            </div>

            <h1 className="display-6 fw-bold mb-3">{product.name}</h1>
            <p className="text-secondary fs-5 mb-4">{product.description}</p>

            <div className="detail-price mb-4">{formatCurrency(product.price)}</div>

            <div className="detail-meta row g-3 mb-4">
              <div className="col-6">
                <span className="detail-meta-label">Categoría</span>
                <strong>{product.category}</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Stock disponible</span>
                <strong>{product.stock} unidades</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Código</span>
                <strong>HS-{String(product.id).padStart(4, '0')}</strong>
              </div>
              <div className="col-6">
                <span className="detail-meta-label">Garantía</span>
                <strong>12 meses</strong>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <Link className="btn btn-dark btn-lg" to="/productos">
                <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                Volver al catálogo
              </Link>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-lg"
                    onClick={() => navigate(`/admin?edit=${product.id}`)}
                  >
                    <i className="bi bi-pencil-square me-2" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-lg"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <i className="bi bi-trash3 me-2" aria-hidden="true" />
                    Eliminar
                  </button>
                </>
              )}
            </div>

            {isAdmin && (
              <div className="alert alert-warning d-flex align-items-start gap-2 mb-0" role="status">
                <i className="bi bi-shield-check fs-5" aria-hidden="true" />
                <div className="small">
                  Estás viendo el producto como <strong>administrador</strong>. Podés modificarlo o
                  eliminarlo desde este detalle.
                </div>
              </div>
            )}
          </div>
        </div>
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
