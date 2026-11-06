export function getPaymentMethod(methods = [], id) {
  return methods.find((method) => method.id === id) || methods[0] || null
}

export function detectCardBrand(cardNumber, brands = []) {
  const digits = String(cardNumber || '').replace(/\D/g, '')
  if (!digits) return 'Tarjeta'

  const brand = brands.find((item) =>
    (Array.isArray(item.prefixes) ? item.prefixes : []).some((prefix) =>
      digits.startsWith(String(prefix)),
    ),
  )

  return brand?.label || 'Tarjeta'
}
