import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { DEMO_ACCOUNTS } from '../data/users'

function Login() {
  const { login, logout, isAuthenticated, user, isAdmin } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from
  const requestedPath = from?.pathname
    ? `${from.pathname}${from.search || ''}`
    : null

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Ingresá tu correo electrónico y contraseña.')
      return
    }

    setSubmitting(true)
    const result = login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      showToast(result.error, 'danger', 'Acceso denegado')
      return
    }

    showToast(`Bienvenido/a, ${result.user.name}.`, 'success', 'Sesión iniciada')
    const destination =
      requestedPath || (result.user.role === 'admin' ? '/admin' : '/perfil')
    navigate(destination, { replace: true })
  }

  const fillDemoAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  const handleLogout = () => {
    logout()
    showToast('Cerraste sesión correctamente.', 'info', 'Hasta pronto')
    navigate('/')
  }

  if (isAuthenticated) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5 text-center">
                <span className="status-icon status-icon-success mx-auto">
                  <i className="bi bi-person-check-fill" aria-hidden="true" />
                </span>
                <h1 className="h3 mt-4">Ya tenés una sesión activa</h1>
                <p className="text-secondary mb-3">
                  Estás conectado como <strong>{user.name}</strong> con el rol{' '}
                  <span className={`badge ${isAdmin ? 'text-bg-warning' : 'text-bg-secondary'}`}>
                    {isAdmin ? 'Administrador' : 'Usuario'}
                  </span>
                </p>
                <p className="text-secondary small mb-4">
                  La sesión se conserva en LocalStorage (solo datos básicos, sin contraseña).
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Link className="btn btn-brand" to="/perfil">
                    <i className="bi bi-person-circle me-1" aria-hidden="true" />
                    Mi perfil
                  </Link>
                  {isAdmin && (
                    <Link className="btn btn-outline-dark" to="/admin">
                      Ir al panel
                    </Link>
                  )}
                  <Link className="btn btn-outline-dark" to="/productos">
                    Catálogo
                  </Link>
                  <Link className="btn btn-outline-dark" to="/carrito">
                    Carrito
                  </Link>
                  <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="login-page py-4 py-lg-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card login-card border-0 shadow-lg">
              <div className="row g-0">
                <div className="col-lg-5 login-aside">
                  <Link className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none" to="/">
                    <span className="brand-mark">
                      <i className="bi bi-pc-display-horizontal" aria-hidden="true" />
                    </span>
                    <span className="fs-4 fw-bold text-white">
                      Hard<span className="text-brand">Store</span>
                    </span>
                  </Link>

                  <h1 className="h2 text-white mb-3">Ingresá a tu cuenta</h1>
                  <p className="text-white-50 small mb-4">
                    Iniciá sesión para comprar, seguir tus pedidos, dejar opiniones y, si sos
                    administrador, gestionar todo el catálogo.
                  </p>

                  <ul className="list-unstyled login-features mb-4">
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Carrito y checkout con pagos simulados</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Historial de pedidos y dashboard personal</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Opiniones con likes y dislikes</li>
                    <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> CRUD completo y rutas protegidas por rol</li>
                  </ul>

                  <div className="small text-white-50">
                    <span className="d-block text-uppercase fw-bold mb-2 login-demo-title">
                      Cuentas de prueba
                    </span>
                    {DEMO_ACCOUNTS.map((account) => (
                      <div className="demo-account" key={account.email}>
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span className={`badge ${account.role === 'admin' ? 'text-bg-warning' : 'text-bg-secondary'}`}>
                            {account.role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                          <code>{account.email}</code>
                        </div>
                        <span className="demo-password">Contraseña: {account.password}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="p-4 p-lg-5">
                    <span className="section-kicker">Acceso</span>
                    <h2 className="h3 mb-1">Iniciar sesión</h2>
                    <p className="text-secondary mb-4">
                      Ingresá tus credenciales para continuar.
                    </p>

                    {error && (
                      <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                        <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
                        <span className="small">{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="login-email">
                          Correo electrónico
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" aria-hidden="true">
                            <i className="bi bi-envelope" />
                          </span>
                          <input
                            id="login-email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value)
                              setError('')
                            }}
                            placeholder="usuario@hardstore.com"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" htmlFor="login-password">
                          Contraseña
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" aria-hidden="true">
                            <i className="bi bi-lock" />
                          </span>
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            value={password}
                            onChange={(event) => {
                              setPassword(event.target.value)
                              setError('')
                            }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-brand btn-lg w-100" disabled={submitting}>
                        {submitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                        Ingresar
                        <i className="bi bi-box-arrow-in-right ms-2" aria-hidden="true" />
                      </button>
                    </form>

                    <div className="d-flex align-items-center gap-3 my-4">
                      <hr className="flex-grow-1 m-0" />
                      <span className="small text-secondary text-nowrap">Completar credenciales demo</span>
                      <hr className="flex-grow-1 m-0" />
                    </div>

                    <div className="d-grid gap-2">
                      {DEMO_ACCOUNTS.map((account) => (
                        <button
                          key={account.email}
                          type="button"
                          className="btn btn-outline-secondary d-flex align-items-center gap-2 text-start"
                          onClick={() => fillDemoAccount(account)}
                        >
                          <i className="bi bi-person-badge" aria-hidden="true" />
                          <span className="small">
                            <strong className="d-block">{account.label}</strong>
                            {account.email}
                          </span>
                          <i className="bi bi-arrow-right ms-auto" aria-hidden="true" />
                        </button>
                      ))}
                    </div>

                    <p className="small text-secondary mt-4 mb-0">
                      <i className="bi bi-info-circle me-1" aria-hidden="true" />
                      Autenticación simulada con fines académicos. Las contraseñas no se guardan en
                      LocalStorage.
                    </p>
                    <p className="small mb-0 mt-2">
                      <Link to="/productos">Continuar como visitante</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
