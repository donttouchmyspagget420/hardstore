import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

function AccessDenied() {
  const { user } = useAuth()

  return (
    <section className="status-page">
      <div className="container py-5">
        <div className="status-card mx-auto text-center">
          <span className="status-icon status-icon-danger mx-auto">
            <i className="bi bi-shield-lock-fill" aria-hidden="true" />
          </span>
          <span className="status-code">403</span>
          <h1 className="h2 mb-2">Acceso denegado</h1>
          <p className="text-secondary mb-4">
            La sección de administración está reservada para usuarios con rol{' '}
            <strong>administrador</strong>.
            {user && (
              <>
                {' '}Tu sesión actual es de <strong>{user.name}</strong> con rol{' '}
                <span className="badge text-bg-secondary">{user.role}</span>.
              </>
            )}
            {' '}Podés seguir consultando el catálogo público.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link className="btn btn-brand" to="/productos">
              <i className="bi bi-grid me-1" aria-hidden="true" />
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

export default AccessDenied
