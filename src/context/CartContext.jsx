import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CartContext } from './cart-context'
import { useAuth } from './auth-context'
import { useStore } from './store-context'
import { calculateSubtotal, calculateTotals, roundCurrency } from '../utils/cart'

const STORAGE_KEY = 'hardstore_cart'

function sanitizeItem(item) {
  if (!item || typeof item !== 'object') return null
  if (item.productId == null || !item.name) return null

  const price = Number(item.price)
  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))
  const stock = Math.max(0, Math.floor(Number(item.stock) || 0))

  if (!Number.isFinite(price) || price < 0) return null
  if (stock <= 0) return null

  return {
    productId: item.productId,
    name: String(item.name),
    category: String(item.category || ''),
    brand: String(item.brand || ''),
    price: roundCurrency(price),
    image: String(item.image || ''),
    stock,
    quantity: Math.min(quantity, Math.max(1, stock)),
  }
}

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map(sanitizeItem).filter(Boolean)
  } catch {
    return []
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const { user } = useAuth()
  const { settings } = useStore()
  const previousUserId = useRef(user?.id ?? null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // El carrito seguirá funcionando en memoria si LocalStorage falla.
    }
  }, [items])

  // Vacía el carrito cuando se cierra sesión o se cambia de cuenta.
  useEffect(() => {
    const currentUserId = user?.id ?? null

    if (previousUserId.current && previousUserId.current !== currentUserId) {
      setItems([])
    }

    previousUserId.current = currentUserId
  }, [user])

  const addItem = useCallback(
    (product, quantity = 1) => {
      const stock = Math.max(0, Math.floor(Number(product.stock) || 0))
      if (stock <= 0) return { ok: false, reason: 'out-of-stock' }

      const requested = Math.max(1, Math.floor(Number(quantity) || 1))
      const current = items.find((item) => String(item.productId) === String(product.id))
      const nextQuantity = Math.min(stock, (current?.quantity || 0) + requested)

      if (current && nextQuantity === current.quantity) {
        return { ok: false, reason: 'max-stock', quantity: current.quantity }
      }

      setItems((previous) => {
        const existing = previous.find((item) => String(item.productId) === String(product.id))
        const item = {
          productId: product.id,
          name: product.name,
          category: product.category || '',
          brand: product.brand || '',
          price: roundCurrency(product.price),
          image: product.image || '',
          stock,
          quantity: nextQuantity,
        }

        if (existing) {
          return previous.map((entry) =>
            String(entry.productId) === String(product.id) ? { ...entry, ...item } : entry,
          )
        }

        return [...previous, item]
      })

      return { ok: true, quantity: nextQuantity }
    },
    [items],
  )

  const updateQuantity = useCallback((productId, quantity) => {
    const requested = Math.max(0, Math.floor(Number(quantity) || 0))

    setItems((previous) =>
      previous
        .map((item) =>
          String(item.productId) === String(productId)
            ? {
                ...item,
                quantity: Math.min(
                  requested,
                  Number.isFinite(Number(item.stock)) ? Math.max(0, Number(item.stock)) : requested,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((previous) =>
      previous.filter((item) => String(item.productId) !== String(productId)),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totals = useMemo(() => calculateTotals(items, settings?.shipping), [items, settings])
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal: calculateSubtotal(items),
      shipping: totals.shipping,
      total: totals.total,
      missingForFreeShipping: totals.missingForFreeShipping,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, totals, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
