const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : '—'
}

export function formatNumber(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? new Intl.NumberFormat('es-AR').format(amount) : '—'
}

export function getStockState(stock) {
  const amount = Number(stock) || 0
  if (amount === 0) {
    return { label: 'Sin stock', badge: 'text-bg-danger', tone: 'danger' }
  }
  if (amount <= 5) {
    return { label: `Últimas ${amount} unidades`, badge: 'text-bg-warning', tone: 'warning' }
  }
  return { label: 'En stock', badge: 'text-bg-success', tone: 'success' }
}
