import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { useOrders } from '../hooks/useOrders'
import { useReviews } from '../hooks/useReviews'
import { DEFAULT_IMAGE } from '../data/categories'
import { formatCurrency, formatDate, getInitials } from '../utils/format'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import OrderStatusBadge from '../components/OrderStatusBadge'
import StarRating from '../components/StarRating'

function Profile() {
  const { user, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const { orders, loading, error, refetch } = useOrders(user?.id)
  const { reviews } = useReviews()

  const myReviews = useMemo(
    () => reviews.filter((review) => review.userId === user?.id),
    [reviews, user?.id],
  )

  const stats = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== 'Cancelado')
    const totalSpent = activeOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const productsBought = activeOrders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0),
      0,
    )
    const averageOrder = activeOrders.length ? totalSpent / activeOrders.length : 0
    const receivedLikes = myReviews.reduce((sum, review) => sum + Number(review.likes || 0), 0)

    const categoryMap = new Map()
    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.category || 'Otros'
        const amount = Number(item.price || 0) * Number(item.quantity || 0)
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount)
      })
    })

    const categoryTotal = [...categoryMap.values()].reduce((sum, amount) => sum + amount, 0)
    const categories = [...categoryMap.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        percent: categoryTotal ? Math.round((amount / categoryTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    return {
      totalOrders: orders.length,
      activeOrders: activeOrders.length,
      totalSpent,
      productsBought,
      averageOrder,
      receivedLikes,
      categories,
      favoriteCategory: categories[0]?.category || '—',
      lastOrder: orders[0] || null,
    }
  }, [orders, myReviews])

  if (!user) return null

  return (
    <>
      <section className="page-hero profile-hero">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Mi perfil
              </li>
            </ol>
          </nav>

          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(user.name)}
            </div>
            <div className="flex-grow-1">
              <span className="section-kicker text-brand">Panel personal</span>
              <h1 className="display-5 fw-bold text-white mb-2">Hola, {user.name.split(' ')[0]}</h1>
              <p className="text-white-50 mb-2">
                Revisá tu historial de compras, tus opiniones y los datos de tu cuenta.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className={`badge ${isAdmin ? 'text-bg-warning' : 'badge-soft-light'}`}>
                  {isAdmin ? 'Administrador' : 'Cliente'}
                </span>
                <span className="badge badge-soft-light">{user.email}</span>
              </div>
            </div>
            <Link className="btn btn-brand btn-lg flex-shrink-0" to="/productos">
              <i className="bi bi-bag-plus me-2" aria-hidden="true" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <div className="row g-3 mb-4">
          <div className="col-6 col-xl-3">
            <div className="profile-stat">
              <span className="profile-stat-icon"><i className="bi bi-receipt" aria-hidden="true" /></span>
              <div>
                <span className="profile-stat-label">Pedidos realizados</span>
                <strong>{loading ? '—' : stats.totalOrders}</strong>
              </div>
            </div>
          </div>
          <div className="col-6 col-xl-3">
            <div className="profile-stat">
              <span className="profile-stat-icon"><i className="bi bi-cash-stack" aria-hidden="true" /></span>
              <div>
                <span className="profile-stat-label">Total invertido</span>
                <strong>{loading ? '—' : formatCurrency(stats.totalSpent)}</strong>
              </div>
            </div>
          </div>
          <div className="col-6 col-xl-3">
            <div className="profile-stat">
              <span className="profile-stat-icon"><i className="bi bi-box-seam" aria-hidden="true" /></span>
              <div>
                <span className="profile-stat-label">Productos comprados</span>
                <strong>{loading ? '—' : stats.productsBought}</strong>
              </div>
            </div>
          </div>
          <div className="col-6 col-xl-3">
            <div className="profile-stat">
              <span className="profile-stat-icon"><i className="bi bi-chat-square-heart" aria-hidden="true" /></span>
              <div>
                <span className="profile-stat-label">Opiniones y likes</span>
                <strong>{loading ? '—' : `${myReviews.length} · ${stats.receivedLikes}`}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        <div className="row g-4">
          <div className="col-xl-8">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <span className="section-kicker">Historial</span>
                    <h2 className="h4 mt-1 mb-0">Mis pedidos</h2>
                  </div>
                  <Link className="btn btn-sm btn-outline-dark" to="/productos">
                    <i className="bi bi-plus-lg me-1" aria-hidden="true" />
                    Nuevo pedido
                  </Link>
                </div>

                {loading ? (
                  <Loader compact label="Cargando historial de pedidos..." />
                ) : orders.length === 0 ? (
                  <EmptyState
                    title="Todavía no hiciste pedidos"
                    message="Cuando compres algo, vas a poder seguir el estado y ver el detalle desde acá."
                    action={
                      <Link className="btn btn-brand" to="/productos">
                        Explorar catálogo
                      </Link>
                    }
                  />
                ) : (
                  <div className="order-list">
                    {orders.map((order) => {
                      const units = order.items.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      )

                      return (
                        <article className="order-card" key={order.id}>
                          <div className="order-card-head">
                            <div>
                              <span className="order-number">Pedido #{order.id}</span>
                              <span className="text-secondary small d-block">
                                {formatDate(order.createdAt)} · {units}{' '}
                                {units === 1 ? 'unidad' : 'unidades'}
                              </span>
                            </div>
                            <OrderStatusBadge status={order.status} />
                          </div>

                          <div className="order-card-body">
                            <div className="order-thumbs" aria-hidden="true">
                              {order.items.slice(0, 3).map((item) => (
                                <img
                                  key={`${order.id}-${item.productId}`}
                                  src={item.image || DEFAULT_IMAGE}
                                  alt=""
                                  onError={(event) => {
                                    event.currentTarget.onerror = null
                                    event.currentTarget.src = DEFAULT_IMAGE
                                  }}
                                />
                              ))}
                              {order.items.length > 3 && (
                                <span className="order-thumbs-more">+{order.items.length - 3}</span>
                              )}
                            </div>

                            <div className="order-card-info">
                              <strong>{formatCurrency(order.total)}</strong>
                              <span className="text-secondary small">
                                {order.paymentMethod} · {order.paymentDetail}
                              </span>
                            </div>

                            <Link className="btn btn-sm btn-outline-dark flex-shrink-0" to={`/perfil/pedidos/${order.id}`}>
                              Ver detalle
                              <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                            </Link>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <span className="section-kicker">Comunidad</span>
                    <h2 className="h4 mt-1 mb-0">Mis opiniones</h2>
                  </div>
                  <span className="badge badge-soft">{myReviews.length} publicadas</span>
                </div>

                {myReviews.length === 0 ? (
                  <p className="text-secondary mb-0">
                    Todavía no dejaste opiniones. Entrá al detalle de un producto que hayas comprado
                    y contá tu experiencia.
                  </p>
                ) : (
                  <div className="profile-review-list">
                    {myReviews.map((review) => (
                      <article className="profile-review" key={review.id}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <Link className="fw-semibold" to={`/productos/${review.productId}`}>
                            {review.productName}
                          </Link>
                          <span className="text-secondary small">{formatDate(review.createdAt)}</span>
                        </div>
                        <StarRating value={Number(review.rating) || 0} size="sm" />
                        <p className="text-secondary small mb-2">{review.comment}</p>
                        <div className="d-flex gap-3 small text-secondary">
                          <span>
                            <i className="bi bi-hand-thumbs-up me-1" aria-hidden="true" />
                            {review.likes || 0} me gusta
                          </span>
                          <span>
                            <i className="bi bi-hand-thumbs-down me-1" aria-hidden="true" />
                            {review.dislikes || 0} no me gusta
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="col-xl-4">
            <aside className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <span className="section-kicker">Dashboard</span>
                <h2 className="h5 mt-1 mb-3">Tu actividad</h2>

                <div className="dashboard-highlight">
                  <span>Consumo por categoría</span>
                  {stats.categories.length === 0 ? (
                    <p className="small text-secondary mb-0">Todavía no hay compras registradas.</p>
                  ) : (
                    <div className="category-breakdown">
                      {stats.categories.slice(0, 5).map((item) => (
                        <div className="category-breakdown-row" key={item.category}>
                          <div className="d-flex justify-content-between small mb-1">
                            <span>{item.category}</span>
                            <span className="text-secondary">{formatCurrency(item.amount)}</span>
                          </div>
                          <div className="progress" role="progressbar" aria-label={`Consumo en ${item.category}`} aria-valuenow={item.percent} aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dashboard-list">
                  <div>
                    <span>Ticket promedio</span>
                    <strong>{formatCurrency(stats.averageOrder)}</strong>
                  </div>
                  <div>
                    <span>Categoría favorita</span>
                    <strong>{stats.favoriteCategory}</strong>
                  </div>
                  <div>
                    <span>Pedidos activos</span>
                    <strong>{stats.activeOrders}</strong>
                  </div>
                  <div>
                    <span>Último pedido</span>
                    <strong>{stats.lastOrder ? formatDate(stats.lastOrder.createdAt) : '—'}</strong>
                  </div>
                </div>

                {stats.lastOrder && (
                  <Link className="btn btn-outline-dark w-100 mt-3" to={`/perfil/pedidos/${stats.lastOrder.id}`}>
                    Ver último pedido
                    <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </aside>

            <aside className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <span className="section-kicker">Cuenta</span>
                <h2 className="h5 mt-1 mb-3">Datos personales</h2>
                <dl className="account-list mb-0">
                  <div>
                    <dt>Nombre</dt>
                    <dd>{user.name}</dd>
                  </div>
                  <div>
                    <dt>Correo</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div>
                    <dt>Rol</dt>
                    <dd>{isAdmin ? 'Administrador' : 'Cliente'}</dd>
                  </div>
                  <div>
                    <dt>Identificador</dt>
                    <dd><code>{user.id}</code></dd>
                  </div>
                </dl>
                <p className="small text-secondary mt-3 mb-0">
                  <i className="bi bi-info-circle me-1" aria-hidden="true" />
                  La sesión se guarda en LocalStorage sin contraseña.
                </p>
              </div>
            </aside>

            <aside className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <span className="section-kicker">Accesos rápidos</span>
                <h2 className="h5 mt-1 mb-3">Seguí navegando</h2>
                <div className="d-grid gap-2">
                  <Link className="btn btn-outline-dark text-start" to="/carrito">
                    <i className="bi bi-cart3 me-2" aria-hidden="true" />
                    Carrito ({itemCount})
                  </Link>
                  <Link className="btn btn-outline-dark text-start" to="/productos">
                    <i className="bi bi-grid me-2" aria-hidden="true" />
                    Catálogo completo
                  </Link>
                  {isAdmin && (
                    <Link className="btn btn-outline-dark text-start" to="/admin">
                      <i className="bi bi-speedometer2 me-2" aria-hidden="true" />
                      Panel de administración
                    </Link>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
