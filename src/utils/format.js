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

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatDateTime(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
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
