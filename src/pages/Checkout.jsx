import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { useStore } from '../context/store-context'
import { useToast } from '../context/toast-context'
import { orderApi, productApi } from '../services/api'
import { detectCardBrand, getPaymentMethod } from '../utils/shop'
import { DEFAULT_IMAGE } from '../utils/constants'
import { formatCurrency } from '../utils/format'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function isValidExpiry(value) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)
  if (!match) return false

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const expiryDate = new Date(year, month, 1)
  return expiryDate > new Date()
}

function validate(address, payment, method) {
  const errors = {}

  if (!method) {
    errors.method = 'Seleccioná un método de pago.'
    return errors
  }

  if (address.fullName.trim().length < 3) errors.fullName = 'Ingresá el nombre completo.'
  if (address.address.trim().length < 5) errors.address = 'Ingresá una dirección válida.'
  if (address.city.trim().length < 2) errors.city = 'Ingresá la ciudad.'
  if (!address.province) errors.province = 'Seleccioná una provincia.'
  if (address.postalCode.trim().length < 3) errors.postalCode = 'Ingresá el código postal.'
  if (address.phone.replace(/\D/g, '').length < 6) errors.phone = 'Ingresá un teléfono de contacto.'

  if (method.requiresCard) {
    const digits = payment.cardNumber.replace(/\D/g, '')
    if (digits.length < 15 || digits.length > 19) {
      errors.cardNumber = 'Ingresá un número de tarjeta válido (15 a 19 dígitos).'
    }
    if (payment.cardName.trim().length < 3) {
      errors.cardName = 'Ingresá el nombre tal como figura en la tarjeta.'
    }
    if (!isValidExpiry(payment.expiry)) {
      errors.expiry = 'Usá el formato MM/AA y verificá que la tarjeta no esté vencida.'
    }
    if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = 'El código de seguridad tiene 3 o 4 dígitos.'
    }
  }

  return errors
}

function Checkout() {
  const { user } = useAuth()
  const { items, subtotal, shipping, total, clearCart } = useCart()
  const { settings, loading: settingsLoading, error: settingsError, refetch: refetchSettings } =
    useStore()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const paymentMethods = settings?.paymentMethods || []
  const provinces = settings?.provinces || []
  const cardBrands = settings?.cardBrands || []

  const [address, setAddress] = useState(() => ({
    fullName: user?.name || '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  }))
  const [payment, setPayment] = useState({
    method: '',
    cardNumber: '',
    cardName: user?.name || '',
    expiry: '',
    cvv: '',
    installments: '1',
  })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  const method = getPaymentMethod(paymentMethods, payment.method)
  const selectedProvince = address.province || provinces[0] || ''
  const cardDigits = payment.cardNumber.replace(/\D/g, '')
  const cardBrand = detectCardBrand(cardDigits, cardBrands)

  if (settingsLoading) {
    return (
      <div className="container py-5">
        <Loader label="Cargando configuración de pago..." />
      </div>
    )
  }

  if (settingsError) {
    return (
      <div className="container py-5">
        <ErrorMessage message={settingsError} onRetry={refetchSettings} />
      </div>
    )
  }

  if (!method) {
    return (
      <div className="container py-5">
        <ErrorMessage
          message="No hay métodos de pago configurados. Configurá el recurso settings en db.json."
          onRetry={refetchSettings}
        />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <EmptyState
              title="No hay productos para pagar"
              message="Tu carrito está vacío. Agregá productos antes de iniciar el checkout."
              action={
                <Link className="btn btn-brand" to="/productos">
                  <i className="bi bi-grid me-1" aria-hidden="true" />
                  Ir al catálogo
                </Link>
              }
            />
          </div>
        </div>
      </section>
    )
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setAddress((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    let nextValue = value

    if (name === 'cardNumber') nextValue = formatCardNumber(value)
    if (name === 'expiry') nextValue = formatExpiry(value)
    if (name === 'cvv') nextValue = value.replace(/\D/g, '').slice(0, 4)

    setPayment((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const selectMethod = (methodId) => {
    setPayment((current) => ({ ...current, method: methodId }))
    setErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (processing) return

    const effectiveAddress = { ...address, province: selectedProvince }
    const nextErrors = validate(effectiveAddress, payment, method)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      showToast('Revisá los datos marcados antes de confirmar el pago.', 'danger', 'Faltan datos')
      document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setProcessing(true)

    try {
      // Simulamos la comunicación con la pasarela de pago.
      await new Promise((resolve) => {
        setTimeout(resolve, 900)
      })

      const last4 = cardDigits.slice(-4)
      let paymentDetail = ''
      let paymentStatus = ''

      if (method.id === 'credit') {
        const installments = Number(payment.installments) || 1
        paymentDetail = `${cardBrand} •••• ${last4} · ${installments} ${
          installments === 1 ? 'cuota' : 'cuotas'
        }`
        paymentStatus = 'Pago aprobado (simulado)'
      } else if (method.id === 'debit') {
        paymentDetail = `${cardBrand} •••• ${last4}`
        paymentStatus = 'Pago aprobado (simulado)'
      } else if (method.id === 'transfer') {
        paymentDetail = 'Transferencia al alias HARDSTORE.AR'
        paymentStatus = 'Pago a acreditar'
      } else {
        paymentDetail = 'Pago en efectivo al retirar en el local'
        paymentStatus = 'Pendiente de pago'
      }

      const order = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shipping,
        total,
        paymentMethod: method.label,
        paymentDetail,
        paymentStatus,
        status: 'Confirmado',
        createdAt: new Date().toISOString(),
        shippingAddress: {
          fullName: address.fullName.trim(),
          address: address.address.trim(),
          city: address.city.trim(),
          province: selectedProvince,
          postalCode: address.postalCode.trim(),
          phone: address.phone.trim(),
        },
      }

      const created = await orderApi.create(order)

      // Descontamos el stock de cada producto como mejor esfuerzo.
      await Promise.all(
        items.map(async (item) => {
          try {
            const fresh = await productApi.getById(item.productId)
            const nextStock = Math.max(0, Number(fresh.stock) - item.quantity)
            await productApi.update(item.productId, { stock: nextStock })
          } catch {
            return null
          }
        }),
      )

      clearCart()
      showToast('Tu pedido se confirmó correctamente.', 'success', 'Compra realizada')
      navigate(`/perfil/pedidos/${created.id}`)
    } catch (submitError) {
      showToast(submitError.message, 'danger', 'No se pudo completar el pago')
      setProcessing(false)
    }
  }

  const fieldClass = (name) => `form-control${errors[name] ? ' is-invalid' : ''}`

  return (
    <>
      <section className="page-hero">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/carrito">Carrito</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>
          <span className="section-kicker text-brand">Pago seguro simulado</span>
          <h1 className="display-5 fw-bold text-white mb-2">Finalizar compra</h1>
          <p className="text-white-50 mb-0">
            Completá los datos de envío y elegí cómo querés pagar. No almacenamos datos sensibles de
            tu tarjeta.
          </p>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm checkout-card mb-4">
                <div className="card-body p-4 p-lg-5">
                  <div className="checkout-section-heading">
                    <span className="checkout-step">1</span>
                    <div>
                      <h2 className="h5 mb-1">Datos de envío</h2>
                      <p className="text-secondary small mb-0">
                        Usamos estos datos para entregar tu pedido.
                      </p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label" htmlFor="checkout-full-name">
                        Nombre completo
                      </label>
                      <input
                        id="checkout-full-name"
                        type="text"
                        name="fullName"
                        className={fieldClass('fullName')}
                        value={address.fullName}
                        onChange={handleAddressChange}
                        autoComplete="name"
                      />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="checkout-address">
                        Dirección y número
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        name="address"
                        className={fieldClass('address')}
                        value={address.address}
                        onChange={handleAddressChange}
                        placeholder="Av. Corrientes 1234, Piso 5 B"
                        autoComplete="street-address"
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="checkout-city">
                        Ciudad
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        name="city"
                        className={fieldClass('city')}
                        value={address.city}
                        onChange={handleAddressChange}
                        autoComplete="address-level2"
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="checkout-province">
                        Provincia
                      </label>
                      <select
                        id="checkout-province"
                        name="province"
                        className={`form-select${errors.province ? ' is-invalid' : ''}`}
                        value={selectedProvince}
                        onChange={handleAddressChange}
                        autoComplete="address-level1"
                      >
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="checkout-postal-code">
                        Código postal
                      </label>
                      <input
                        id="checkout-postal-code"
                        type="text"
                        name="postalCode"
                        className={fieldClass('postalCode')}
                        value={address.postalCode}
                        onChange={handleAddressChange}
                        autoComplete="postal-code"
                      />
                      {errors.postalCode && (
                        <div className="invalid-feedback">{errors.postalCode}</div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="checkout-phone">
                        Teléfono
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        name="phone"
                        className={fieldClass('phone')}
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="+54 11 5555-1234"
                        autoComplete="tel"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm checkout-card">
                <div className="card-body p-4 p-lg-5">
                  <div className="checkout-section-heading">
                    <span className="checkout-step">2</span>
                    <div>
                      <h2 className="h5 mb-1">Método de pago</h2>
                      <p className="text-secondary small mb-0">
                        Pago simulado con fines académicos. Podés probar cualquier método.
                      </p>
                    </div>
                  </div>

                  <div className="payment-options">
                    {paymentMethods.map((option) => (
                      <label
                        key={option.id}
                        className={`payment-option${method?.id === option.id ? ' is-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.id}
                          checked={method?.id === option.id}
                          onChange={() => selectMethod(option.id)}
                        />
                        <span className="payment-option-icon">
                          <i className={`bi ${option.icon}`} aria-hidden="true" />
                        </span>
                        <span className="payment-option-body">
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </span>
                        <span className="payment-option-check" aria-hidden="true">
                          <i className="bi bi-check-lg" />
                        </span>
                      </label>
                    ))}
                  </div>

                  {method.requiresCard && (
                    <div className="payment-card-fields mt-4">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label" htmlFor="checkout-card-number">
                            Número de tarjeta
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-credit-card" aria-hidden="true" />
                            </span>
                            <input
                              id="checkout-card-number"
                              type="text"
                              inputMode="numeric"
                              name="cardNumber"
                              className={fieldClass('cardNumber')}
                              value={payment.cardNumber}
                              onChange={handlePaymentChange}
                              placeholder="4242 4242 4242 4242"
                              autoComplete="cc-number"
                            />
                            {errors.cardNumber && (
                              <div className="invalid-feedback">{errors.cardNumber}</div>
                            )}
                          </div>
                          {cardDigits.length >= 4 && (
                            <div className="form-text">Marca detectada: {cardBrand}</div>
                          )}
                        </div>

                        <div className="col-12">
                          <label className="form-label" htmlFor="checkout-card-name">
                            Nombre en la tarjeta
                          </label>
                          <input
                            id="checkout-card-name"
                            type="text"
                            name="cardName"
                            className={fieldClass('cardName')}
                            value={payment.cardName}
                            onChange={handlePaymentChange}
                            autoComplete="cc-name"
                          />
                          {errors.cardName && (
                            <div className="invalid-feedback">{errors.cardName}</div>
                          )}
                        </div>

                        <div className="col-6">
                          <label className="form-label" htmlFor="checkout-expiry">
                            Vencimiento
                          </label>
                          <input
                            id="checkout-expiry"
                            type="text"
                            inputMode="numeric"
                            name="expiry"
                            className={fieldClass('expiry')}
                            value={payment.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/AA"
                            autoComplete="cc-exp"
                          />
                          {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                        </div>

                        <div className="col-6">
                          <label className="form-label" htmlFor="checkout-cvv">
                            Código de seguridad
                          </label>
                          <input
                            id="checkout-cvv"
                            type="password"
                            inputMode="numeric"
                            name="cvv"
                            className={fieldClass('cvv')}
                            value={payment.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            autoComplete="cc-csc"
                          />
                          {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                        </div>

                        {method.allowsInstallments && (
                          <div className="col-sm-6">
                            <label className="form-label" htmlFor="checkout-installments">
                              Cuotas
                            </label>
                            <select
                              id="checkout-installments"
                              name="installments"
                              className="form-select"
                              value={payment.installments}
                              onChange={handlePaymentChange}
                            >
                              {[1, 3, 6, 12].map((installments) => (
                                <option key={installments} value={installments}>
                                  {installments} {installments === 1 ? 'cuota' : 'cuotas'}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {method?.id === 'transfer' && (
                    <div className="payment-instructions mt-4">
                      <i className="bi bi-bank" aria-hidden="true" />
                      <div>
                        <strong>Datos para transferir</strong>
                        <p className="mb-0 small">
                          Alias <code>HARDSTORE.AR</code> · CVU{' '}
                          <code>0000003100012345678901</code> · Titular HardStore S.R.L. El pedido
                          queda reservado hasta acreditar el pago.
                        </p>
                      </div>
                    </div>
                  )}

                  {method?.id === 'cash' && (
                    <div className="payment-instructions mt-4">
                      <i className="bi bi-geo-alt" aria-hidden="true" />
                      <div>
                        <strong>Retiro en el local</strong>
                        <p className="mb-0 small">
                          Av. Tecnología 2026, Ciudad Autónoma de Buenos Aires. Lunes a viernes de
                          10 a 19 hs. Pagás cuando retirás el pedido.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="secure-note mt-4">
                    <i className="bi bi-shield-lock" aria-hidden="true" />
                    <span>
                      Solo guardamos la marca y los últimos 4 dígitos de la tarjeta. El número
                      completo y el CVV nunca se persisten.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="card border-0 shadow-sm checkout-summary sticky-lg-top">
                <div className="card-body p-4">
                  <h2 className="h5 mb-3">Tu pedido</h2>

                  <div className="checkout-items">
                    {items.map((item) => (
                      <div className="checkout-item" key={item.productId}>
                        <img
                          src={item.image || DEFAULT_IMAGE}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = DEFAULT_IMAGE
                          }}
                        />
                        <div className="flex-grow-1">
                          <span className="d-block small fw-semibold">{item.name}</span>
                          <span className="text-secondary small">
                            {item.quantity} × {formatCurrency(item.price)}
                          </span>
                        </div>
                        <strong className="small">
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Envío</span>
                    <strong>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</strong>
                  </div>
                  <hr />
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>

                  <button type="submit" className="btn btn-brand btn-lg w-100 mt-3" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2" aria-hidden="true" />
                        Confirmar pago
                      </>
                    )}
                  </button>

                  <Link className="btn btn-link w-100 mt-1" to="/carrito">
                    Volver al carrito
                  </Link>

                  <p className="small text-secondary text-center mb-0">
                    Recibirás un resumen con el número de pedido al confirmar.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Checkout
