import { SHIPPING } from '../data/shop'

export function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function calculateSubtotal(items = []) {
  return roundCurrency(
    items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
  )
}

export function calculateShipping(subtotal) {
  const amount = Number(subtotal) || 0
  if (amount <= 0) return 0
  return amount >= SHIPPING.freeThreshold ? 0 : SHIPPING.cost
}

export function calculateTotals(items = []) {
  const subtotal = calculateSubtotal(items)
  const shipping = calculateShipping(subtotal)
  return {
    subtotal,
    shipping,
    total: roundCurrency(subtotal + shipping),
    missingForFreeShipping: roundCurrency(Math.max(0, SHIPPING.freeThreshold - subtotal)),
  }
}
