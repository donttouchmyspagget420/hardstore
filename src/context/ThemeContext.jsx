import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context'

const STORAGE_KEY = 'hardstore_theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // LocalStorage puede no estar disponible; se usa la preferencia del sistema.
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    document.documentElement.style.colorScheme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // La preferencia se mantiene solo durante la sesión si LocalStorage falla.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
