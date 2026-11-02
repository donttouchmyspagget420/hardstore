import { useCallback, useEffect, useState } from 'react'
import { orderApi } from '../services/api'

export function useOrders(userId) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    const request = userId ? orderApi.getByUser(userId) : orderApi.getAll()

    request
      .then((data) => {
        if (active) {
          setOrders(Array.isArray(data) ? data : [])
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
  }, [userId, reloadToken])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  return { orders, loading, error, refetch }
}

export function useOrder(id) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    orderApi
      .getById(id)
      .then((data) => {
        if (active) {
          setOrder(data)
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
    setOrder(null)
    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  return { order, loading, error, refetch }
}
