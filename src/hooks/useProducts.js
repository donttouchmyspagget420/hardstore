import { useCallback, useEffect, useState } from 'react'
import { productApi } from '../services/api'

/**
 * Hook reutilizable para obtener el catálogo de productos.
 * Administra datos, estado de carga, error y una función para recargar.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    productApi
      .getAll()
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data : [])
          setError(null)
        }
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

  return { products, loading, error, refetch }
}

/**
 * Hook para recuperar un único producto por id (ruta dinámica /productos/:id).
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    productApi
      .getById(id)
      .then((data) => {
        if (active) {
          setProduct(data)
          setError(null)
        }
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
  }, [id, reloadToken])

  const refetch = useCallback(() => {
    setProduct(null)
    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  return { product, loading, error, refetch }
}
