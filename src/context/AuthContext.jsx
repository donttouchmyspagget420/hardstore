import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { USERS } from '../data/users'

const STORAGE_KEY = 'hardstore_session'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.id || !parsed?.role) {
      return null
    }

    // Solo se persisten datos básicos del usuario, nunca la contraseña.
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
    }
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback((email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const found = USERS.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
    )

    if (!found) {
      return { ok: false, error: 'Correo electrónico o contraseña incorrectos.' }
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)

    return { ok: true, user: sessionUser }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
