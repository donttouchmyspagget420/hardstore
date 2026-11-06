const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

async function request(path, options = {}) {
  const { body, headers, ...rest } = options

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(body ? { body } : {}),
    })
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor (${API_URL}). Verificá que JSON Server esté en ejecución con "npm run server".`,
    )
  }

  if (!response.ok) {
    if (response.status === 404) {
      const error = new Error('El recurso solicitado no existe o fue eliminado.')
      error.status = 404
      throw error
    }
    const error = new Error(`La operación no se pudo completar (HTTP ${response.status}).`)
    error.status = response.status
    throw error
  }

  if (response.status === 204) return null
  return response.json()
}

export const productApi = {
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${encodeURIComponent(id)}`),
  create: (product) => request('/products', { method: 'POST', body: JSON.stringify(product) }),
  update: (id, product) =>
    request(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(product) }),
  remove: (id) => request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}

export const categoryApi = {
  getAll: () => request('/categories?_sort=id'),
}

export const userApi = {
  getByEmail: (email) => request(`/users?email=${encodeURIComponent(email)}`),
}

export const settingsApi = {
  get: () => request('/settings/1'),
}

export const reviewApi = {
  getAll: () => request('/reviews?_sort=createdAt&_order=desc'),
  getByProduct: (productId) =>
    request(
      `/reviews?productId=${encodeURIComponent(productId)}&_sort=createdAt&_order=desc`,
    ),
  create: (review) => request('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  update: (id, review) =>
    request(`/reviews/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(review) }),
  remove: (id) => request(`/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}

export const orderApi = {
  getAll: () => request('/orders?_sort=createdAt&_order=desc'),
  getByUser: (userId) =>
    request(`/orders?userId=${encodeURIComponent(userId)}&_sort=createdAt&_order=desc`),
  getById: (id) => request(`/orders/${encodeURIComponent(id)}`),
  create: (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) }),
}

export { API_URL }
