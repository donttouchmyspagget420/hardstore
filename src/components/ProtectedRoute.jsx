import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

/**
 * Protege rutas privadas. Si no hay sesión redirige al login conservando
 * el destino original; si el rol no coincide, redirige a la página 403.
 */
function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && user.role !== role) {
    return <Navigate to="/acceso-denegado" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
