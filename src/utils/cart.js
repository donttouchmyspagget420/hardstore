export function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function calculateSubtotal(items = []) {
  return roundCurrency(
    items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
  )
}

export function calculateShipping(subtotal, shipping = {}) {
  const amount = Number(subtotal) || 0
  if (amount <= 0) return 0

  const freeThreshold = Number(shipping.freeThreshold)
  const cost = Number(shipping.cost)

  if (!Number.isFinite(freeThreshold) || !Number.isFinite(cost)) return 0
  return amount >= freeThreshold ? 0 : cost
}

export function calculateTotals(items = [], shippingConfig = {}) {
  const subtotal = calculateSubtotal(items)
  const shipping = calculateShipping(subtotal, shippingConfig)
  const freeThreshold = Number(shippingConfig.freeThreshold)

  return {
    subtotal,
    shipping,
    total: roundCurrency(subtotal + shipping),
    missingForFreeShipping: Number.isFinite(freeThreshold)
      ? roundCurrency(Math.max(0, freeThreshold - subtotal))
      : 0,
  }
}
