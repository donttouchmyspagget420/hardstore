import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { useProducts } from '../hooks/useProducts'
import { formatNumber } from '../utils/format'

const FEATURES = [
  {
    icon: 'bi-truck',
    title: 'Envíos en 24-48 hs',
    text: 'Despachamos a todo el país con seguimiento en línea.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Garantía oficial',
    text: 'Todos los productos cuentan con 12 meses de garantía.',
  },
  {
    icon: 'bi-credit-card',
    title: 'Hasta 12 cuotas',
    text: 'Financiación sin interés con tarjetas seleccionadas.',
  },
  {
    icon: 'bi-headset',
    title: 'Asesoramiento real',
    text: 'Te ayudamos a elegir el hardware ideal para tu setup.',
  },
]

const CATEGORY_SHOWCASE = [
  {
    name: 'Computación',
    icon: 'bi-laptop',
    text: 'Notebooks y equipos listos para trabajar y jugar.',
  },
  {
    name: 'Componentes',
    icon: 'bi-cpu',
    text: 'Potenciá tu PC con hardware de alto rendimiento.',
  },
  {
    name: 'Periféricos',
    icon: 'bi-keyboard',
    text: 'Teclados, mouse y accesorios para tu escritorio.',
  },
  {
    name: 'Audio',
    icon: 'bi-headphones',
    text: 'Sonido profesional para gaming, música y streaming.',
  },
]

function Home() {
  const { products, loading, error, refetch } = useProducts()

  const featured = useMemo(() => products.slice(0, 4), [products])
  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0),
    [products],
  )
  const categoryCount = useMemo(
    () => new Set(products.map((product) => product.category)).size,
    [products],
  )

  return (
    <>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-lg-6 text-white">
              <span className="badge hero-badge mb-3">
                <i className="bi bi-lightning-charge-fill me-1" aria-hidden="true" />
                Tecnología de alto rendimiento · 2026
              </span>
              <h1 className="display-3 fw-bold lh-1 mb-3">
                Potenciá tu setup con <span className="text-brand">HardStore</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Componentes, notebooks y periféricos seleccionados por especialistas. Calidad
                garantizada para que tu única preocupación sea rendir al máximo.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-brand btn-lg px-4" to="/productos">
                  Ver catálogo
                  <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                </Link>
                <Link className="btn btn-outline-light btn-lg px-4" to="/login">
                  <i className="bi bi-shield-lock me-2" aria-hidden="true" />
                  Acceso admin
                </Link>
              </div>
              <div className="d-flex flex-wrap gap-4 mt-4 small text-white-50">
                <span>
                  <i className="bi bi-check-circle-fill text-brand me-1" aria-hidden="true" />
                  Stock actualizado
                </span>
                <span>
                  <i className="bi bi-check-circle-fill text-brand me-1" aria-hidden="true" />
                  Compra protegida
                </span>
                <span>
                  <i className="bi bi-check-circle-fill text-brand me-1" aria-hidden="true" />
                  Soporte técnico
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-card">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <span className="badge text-bg-warning">Catálogo en vivo</span>
                  <i className="bi bi-activity fs-4 text-brand" aria-hidden="true" />
                </div>

                <div className="row g-3">
                  <div className="col-4">
                    <div className="hero-stat">
                      <i className="bi bi-box-seam" aria-hidden="true" />
                      <strong>{loading ? '—' : formatNumber(products.length)}</strong>
                      <span>Productos</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="hero-stat">
                      <i className="bi bi-stack" aria-hidden="true" />
                      <strong>{loading ? '—' : formatNumber(totalStock)}</strong>
                      <span>Unidades</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="hero-stat">
                      <i className="bi bi-grid-3x3-gap" aria-hidden="true" />
                      <strong>{loading ? '—' : formatNumber(categoryCount)}</strong>
                      <span>Categorías</span>
                    </div>
                  </div>
                </div>

                <div className={`hero-card-note${error ? ' hero-card-note-error' : ''}`}>
                  <i className={`bi ${error ? 'bi-database-x' : 'bi-database-check'}`} aria-hidden="true" />
                  <div>
                    <strong>{error ? 'Backend sin conexión' : 'JSON Server conectado'}</strong>
                    <span>
                      {error
                        ? 'Iniciá el backend con "npm run server" para ver el catálogo.'
                        : 'Los datos se consultan en tiempo real desde el backend provisional.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-strip">
        <div className="container">
          <div className="row g-0">
            {FEATURES.map((feature) => (
              <div className="col-md-6 col-xl-3" key={feature.title}>
                <div className="feature-item">
                  <span className="feature-icon">
                    <i className={`bi ${feature.icon}`} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="h6 mb-1">{feature.title}</h2>
                    <p className="text-secondary small mb-0">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <span className="section-kicker">Selección destacada</span>
            <h2 className="display-6 fw-bold mt-1 mb-0">Productos destacados</h2>
          </div>
          <Link className="btn btn-outline-dark d-none d-sm-inline-flex" to="/productos">
            Ver todos los productos
            <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
          </Link>
        </div>

        {loading && <Loader />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <div className="row g-4">
            {featured.map((product) => (
              <div className="col-sm-6 col-xl-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-4 d-sm-none">
          <Link className="btn btn-outline-dark" to="/productos">
            Ver todos los productos
          </Link>
        </div>
      </section>

      <section className="categories-section py-5">
        <div className="container">
          <div className="row align-items-end justify-content-between gap-3 mb-4">
            <div className="col-lg-7">
              <span className="section-kicker">Explorá por categoría</span>
              <h2 className="display-6 fw-bold mt-1 mb-0">Encontrá lo que buscás</h2>
            </div>
            <div className="col-lg-5 text-lg-end">
              <p className="text-secondary mb-0">
                {products.length || 14} productos disponibles con stock y precios actualizados.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {CATEGORY_SHOWCASE.map((category) => (
              <div className="col-sm-6 col-xl-3" key={category.name}>
                <Link
                  className="category-card"
                  to={`/productos?categoria=${encodeURIComponent(category.name)}`}
                >
                  <span className="category-card-icon">
                    <i className={`bi ${category.icon}`} aria-hidden="true" />
                  </span>
                  <h3 className="h5 mt-3 mb-2">{category.name}</h3>
                  <p className="small text-secondary mb-3">{category.text}</p>
                  <span className="category-card-link">
                    Ver productos
                    <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container py-5">
          <div className="cta-card d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
            <div>
              <span className="section-kicker text-brand">Panel de administración</span>
              <h2 className="h1 text-white mb-2">Gestioná el catálogo en segundos</h2>
              <p className="text-white-50 mb-0">
                Creá, editá y eliminá productos con validaciones, confirmaciones y notificaciones.
              </p>
            </div>
            <Link className="btn btn-brand btn-lg px-4 flex-shrink-0" to="/login">
              Ingresar al panel
              <i className="bi bi-box-arrow-in-right ms-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
