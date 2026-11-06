import { useCallback, useEffect, useMemo, useState } from 'react'
import { StoreContext } from './store-context'
import { categoryApi, settingsApi } from '../services/api'

function StoreProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    Promise.all([categoryApi.getAll(), settingsApi.get()])
      .then(([categoryData, settingsData]) => {
        if (!active) return
        setCategories(Array.isArray(categoryData) ? categoryData : [])
        setSettings(settingsData || null)
        setError(null)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadToken])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  const value = useMemo(
    () => ({ categories, settings, loading, error, refetch }),
    [categories, settings, loading, error, refetch],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default StoreProvider
