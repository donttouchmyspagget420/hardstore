import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="status-page">
      <div className="container py-5">
        <div className="status-card mx-auto text-center">
          <span className="status-icon mx-auto">
            <i className="bi bi-compass" aria-hidden="true" />
          </span>
          <span className="status-code">404</span>
          <h1 className="h2 mb-2">Página no encontrada</h1>
          <p className="text-secondary mb-4">
            La dirección que ingresaste no existe o fue movida. Revisá el enlace o volvé al catálogo.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link className="btn btn-brand" to="/productos">
              Ir al catálogo
            </Link>
            <Link className="btn btn-outline-dark" to="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
