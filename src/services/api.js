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
      const error = new Error('El producto solicitado no existe o fue eliminado.')
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

export { API_URL }
