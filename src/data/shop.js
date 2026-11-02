export const SHIPPING = {
  freeThreshold: 300,
  cost: 19.99,
}

export const PAYMENT_METHODS = [
  {
    id: 'credit',
    label: 'Tarjeta de crédito',
    shortLabel: 'Crédito',
    icon: 'bi-credit-card-2-front',
    description: 'Visa, Mastercard y American Express. Hasta 12 cuotas.',
    requiresCard: true,
    allowsInstallments: true,
  },
  {
    id: 'debit',
    label: 'Tarjeta de débito',
    shortLabel: 'Débito',
    icon: 'bi-credit-card',
    description: 'El pago se debita al confirmar la compra.',
    requiresCard: true,
    allowsInstallments: false,
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria',
    shortLabel: 'Transferencia',
    icon: 'bi-bank',
    description: 'Transferí al alias HARDSTORE.AR y acreditamos el pago.',
    requiresCard: false,
    allowsInstallments: false,
  },
  {
    id: 'cash',
    label: 'Efectivo al retirar',
    shortLabel: 'Efectivo',
    icon: 'bi-cash-coin',
    description: 'Reservá tu pedido y pagalo cuando lo retires en el local.',
    requiresCard: false,
    allowsInstallments: false,
  },
]

export const CARD_BRANDS = [
  { id: 'visa', label: 'Visa', pattern: /^4/ },
  { id: 'mastercard', label: 'Mastercard', pattern: /^5[1-5]/ },
  { id: 'amex', label: 'American Express', pattern: /^3[47]/ },
]

export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find((method) => method.id === id) || PAYMENT_METHODS[0]
}

export function detectCardBrand(cardNumber) {
  const digits = String(cardNumber || '').replace(/\D/g, '')
  const brand = CARD_BRANDS.find((item) => item.pattern.test(digits))
  return brand?.label || 'Tarjeta'
}

export const ORDER_STATUS_FLOW = ['Confirmado', 'Preparando', 'Enviado', 'Entregado']

export const ORDER_STATUSES = {
  Confirmado: {
    tone: 'info',
    icon: 'bi-check2-circle',
    description: 'Recibimos tu pedido y ya está en preparación.',
  },
  Preparando: {
    tone: 'warning',
    icon: 'bi-box-seam',
    description: 'Estamos armando el paquete con tus productos.',
  },
  Enviado: {
    tone: 'primary',
    icon: 'bi-truck',
    description: 'El pedido salió del depósito y está en camino.',
  },
  Entregado: {
    tone: 'success',
    icon: 'bi-check-circle',
    description: 'El pedido se entregó correctamente.',
  },
  Cancelado: {
    tone: 'danger',
    icon: 'bi-x-circle',
    description: 'El pedido fue cancelado.',
  },
}

export const PROVINCES = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]
