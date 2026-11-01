import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const closeMenu = () => setOpen(false)

  const handleLogout = () => {
    setOpen(false)
    logout()
    showToast('Cerraste sesión correctamente.', 'info', 'Hasta pronto')
    navigate('/')
  }

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-primary sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" onClick={closeMenu}>
          <span className="brand-mark">
            <i className="bi bi-pc-display-horizontal" aria-hidden="true" />
          </span>
          <span>
            Hard<span className="text-brand">Store</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-controls="main-navbar"
          aria-expanded={open}
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="main-navbar">
          <ul className="navbar-nav me-auto mb-3 mb-lg-0">
            <li className="nav-item">
              <NavLink end className={navLinkClass} to="/" onClick={closeMenu}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/productos" onClick={closeMenu}>
                Productos
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/admin" onClick={closeMenu}>
                  Administración
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="navbar-user d-flex align-items-center gap-2 me-lg-2">
                  <i className="bi bi-person-circle fs-5" aria-hidden="true" />
                  <span className="fw-semibold">{user.name}</span>
                  <span className={`badge ${isAdmin ? 'text-bg-warning' : 'text-bg-secondary'}`}>
                    {isAdmin ? 'Admin' : 'Usuario'}
                  </span>
                </span>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="btn btn-brand btn-sm px-3" to="/login" onClick={closeMenu}>
                <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true" />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
