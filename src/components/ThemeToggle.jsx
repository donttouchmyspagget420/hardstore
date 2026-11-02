import { useTheme } from '../context/theme-context'

function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className={`btn btn-outline-light btn-sm nav-icon-btn theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} aria-hidden="true" />
      <span className="d-none d-xl-inline ms-1">{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  )
}

export default ThemeToggle
