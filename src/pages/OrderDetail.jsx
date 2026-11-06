import { Link, useParams } from 'react-router-dom'
import { useOrder } from '../hooks/useOrders'
import { useAuth } from '../context/auth-context'
import { useStore } from '../context/store-context'
import { DEFAULT_IMAGE } from '../utils/constants'
import { formatCurrency, formatDateTime } from '../utils/format'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import OrderStatusBadge from '../components/OrderStatusBadge'

function OrderDetailView({ id }) {
  const { order, loading, error, refetch } = useOrder(id)
  const { user, isAdmin } = useAuth()
  const { settings } = useStore()
  const orderStatuses = settings?.orderStatuses || {}
  const orderStatusFlow = settings?.orderStatusFlow || []

  if (loading) {
    return (
      <div className="container py-5">
        <Loader label="Cargando detalle del pedido..." />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <ErrorMessage
          title={error?.includes('no existe') ? 'Pedido no encontrado' : 'No se pudo cargar el pedido'}
          message={error || 'El pedido solicitado no está disponible.'}
          onRetry={refetch}
        />
        <Link className="btn btn-outline-dark mt-3" to="/perfil">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Volver a mi perfil
        </Link>
      </div>
    )
  }

  const isOwner = order.userId === user?.id
  const canView = isOwner || isAdmin

  if (!canView) {
    return (
      <section className="status-page d-flex align-items-center py-5">
        <div className="container">
          <div className="status-card text-center mx-auto">
            <span className="status-icon status-icon-danger mx-auto">
              <i className="bi bi-shield-lock" aria-hidden="true" />
            </span>
            <h1 className="h3 mt-3">Este pedido no te pertenece</h1>
            <p className="text-secondary">
              Solo el titular de la compra o un administrador pueden consultar este pedido.
            </p>
            <Link className="btn btn-brand" to="/perfil">
              Ir a mi perfil
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const statusConfig = orderStatuses[order.status]
  const statusIndex = orderStatusFlow.indexOf(order.status)
  const isCancelled = order.status === 'Cancelado'

  return (
    <>
      <section className="page-hero">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/perfil">Mi perfil</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Pedido #{order.id}
              </li>
            </ol>
          </nav>

          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3">
            <div>
              <span className="section-kicker text-brand">Detalle del pedido</span>
              <h1 className="display-5 fw-bold text-white mb-2">Pedido #{order.id}</h1>
              <p className="text-white-50 mb-0">
                Realizado el {formatDateTime(order.createdAt)} por {order.userName}
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} className="order-status-lg" />
              {isAdmin && !isOwner && (
                <span className="badge text-bg-warning align-self-center">Vista de administrador</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                  <h2 className="h5 mb-0">Estado del pedido</h2>
                  {statusConfig && (
                    <span className="small text-secondary d-none d-sm-inline">
                      {statusConfig.description}
                    </span>
                  )}
                </div>

                {isCancelled ? (
                  <div className="alert alert-danger mb-0">
                    <i className="bi bi-x-circle me-2" aria-hidden="true" />
                    Este pedido fue cancelado. Si tenés dudas, contactanos.
                  </div>
                ) : orderStatusFlow.length === 0 ? (
                  <p className="text-secondary mb-0">No hay información de seguimiento disponible.</p>
                ) : (
                  <ol className="order-timeline">
                    {orderStatusFlow.map((step, index) => {
                      const state =
                        index < statusIndex
                          ? 'is-complete'
                          : index === statusIndex
                            ? 'is-active'
                            : ''

                      return (
                        <li className={`order-timeline-step ${state}`.trim()} key={step}>
                          <span className="order-timeline-dot">
                            <i
                              className={`bi ${
                                index <= statusIndex ? 'bi-check-lg' : 'bi-circle'
                              }`}
                              aria-hidden="true"
                            />
                          </span>
                          <span>{step}</span>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <h2 className="h5 mb-0">Productos del pedido</h2>
                  <span className="badge badge-soft">
                    {order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} unidades
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table order-items-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col" className="text-center">Cantidad</th>
                        <th scope="col" className="text-end">Precio</th>
                        <th scope="col" className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={`${order.id}-${item.productId}`}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={item.image || DEFAULT_IMAGE}
                                alt=""
                                className="order-item-thumb"
                                onError={(event) => {
                                  event.currentTarget.onerror = null
                                  event.currentTarget.src = DEFAULT_IMAGE
                                }}
                              />
                              <div>
                                <Link
                                  className="fw-semibold product-card-title"
                                  to={`/productos/${item.productId}`}
                                >
                                  {item.name}
                                </Link>
                                <span className="text-secondary small d-block">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.price)}</td>
                          <td className="text-end fw-semibold">
                            {formatCurrency(Number(item.price) * Number(item.quantity))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Datos de envío</h2>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Recibe</span>
                    <strong>{order.shippingAddress.fullName}</strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Teléfono</span>
                    <strong>{order.shippingAddress.phone}</strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Dirección</span>
                    <strong>{order.shippingAddress.address}</strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Ciudad y provincia</span>
                    <strong>
                      {order.shippingAddress.city}, {order.shippingAddress.province}
                    </strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Código postal</span>
                    <strong>{order.shippingAddress.postalCode}</strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="detail-meta-label">Correo de contacto</span>
                    <strong>{order.userEmail}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="col-lg-4">
            <aside className="card border-0 shadow-sm checkout-summary mb-4">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Resumen del pago</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(order.subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <strong>{Number(order.shipping) === 0 ? 'Gratis' : formatCurrency(order.shipping)}</strong>
                </div>
                <hr />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>

                <div className="payment-summary mt-4">
                  <span className="detail-meta-label">Método de pago</span>
                  <strong>{order.paymentMethod}</strong>
                  <span className="d-block small text-secondary">{order.paymentDetail}</span>
                  <span className="badge badge-soft mt-2">{order.paymentStatus}</span>
                </div>

                <div className="mt-4 d-grid gap-2">
                  <Link className="btn btn-outline-dark" to="/perfil">
                    <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                    Volver a mis pedidos
                  </Link>
                  <Link className="btn btn-brand" to="/productos">
                    <i className="bi bi-bag me-2" aria-hidden="true" />
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </aside>

            <aside className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h6 mb-2">
                  <i className="bi bi-headset text-brand me-2" aria-hidden="true" />
                  ¿Necesitás ayuda?
                </h2>
                <p className="small text-secondary mb-0">
                  Escribinos a <a href="mailto:soporte@hardstore.com">soporte@hardstore.com</a> con
                  el número de pedido <strong>#{order.id}</strong> y te respondemos dentro de las 24
                  horas.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

function OrderDetail() {
  const { id } = useParams()
  return <OrderDetailView key={id} id={id} />
}

export default OrderDetail
