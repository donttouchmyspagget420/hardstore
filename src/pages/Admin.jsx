import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useStore } from '../context/store-context'
import { productApi } from '../services/api'
import { DEFAULT_IMAGE } from '../utils/constants'
import { formatCurrency, formatNumber, getStockState } from '../utils/format'

function Admin() {
  const { products, loading, error, refetch } = useProducts()
  const { categories } = useStore()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [saving, setSaving] = useState(false)
  const [formVersion, setFormVersion] = useState(0)
  const [tableSearch, setTableSearch] = useState('')
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const editId = searchParams.get('edit')
  const editingProduct = useMemo(
    () => (editId ? products.find((product) => String(product.id) === String(editId)) : null),
    [products, editId],
  )

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0)
    const inventoryValue = products.reduce(
      (sum, product) => sum + Number(product.price) * (Number(product.stock) || 0),
      0,
    )
    const lowStock = products.filter((product) => Number(product.stock) <= 5).length
    return { totalStock, inventoryValue, lowStock }
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = tableSearch.trim().toLowerCase()
    if (!term) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        String(product.brand || '').toLowerCase().includes(term) ||
        String(product.sku || '').toLowerCase().includes(term),
    )
  }, [products, tableSearch])

  const closeEditor = () => {
    setSearchParams({}, { replace: true })
    setFormVersion((version) => version + 1)
  }

  const handleNewProduct = () => {
    closeEditor()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (product) => {
    setSearchParams({ edit: String(product.id) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, values)
        showToast(`"${values.name}" se actualizó correctamente.`, 'success', 'Producto actualizado')
      } else {
        await productApi.create(values)
        showToast(`"${values.name}" se agregó al catálogo.`, 'success', 'Producto creado')
      }
      closeEditor()
      refetch()
    } catch (submitError) {
      showToast(submitError.message, 'danger', 'No se pudo guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    setDeleting(true)
    try {
      await productApi.remove(productToDelete.id)
      if (editingProduct && String(editingProduct.id) === String(productToDelete.id)) {
        closeEditor()
      }
      showToast(`"${productToDelete.name}" se eliminó del catálogo.`, 'success', 'Producto eliminado')
      setProductToDelete(null)
      refetch()
    } catch (deleteError) {
      showToast(deleteError.message, 'danger', 'No se pudo eliminar el producto')
    } finally {
      setDeleting(false)
    }
  }

  const imageFallback = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = DEFAULT_IMAGE
  }

  const editInProgress = Boolean(editId)

  return (
    <>
      <section className="page-hero">
        <div className="container py-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Administración
              </li>
            </ol>
          </nav>
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3">
            <div>
              <span className="section-kicker text-brand">Panel de administración</span>
              <h1 className="display-5 fw-bold text-white mb-2">Hola, {user?.name?.split(' ')[0]}</h1>
              <p className="text-white-50 mb-0">
                Gestioná el catálogo: creá, editá y eliminá productos con persistencia en JSON Server.
              </p>
            </div>
            <button type="button" className="btn btn-brand btn-lg align-self-start" onClick={handleNewProduct}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Nuevo producto
            </button>
          </div>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat">
              <span className="admin-stat-icon"><i className="bi bi-box-seam" aria-hidden="true" /></span>
              <div>
                <span className="admin-stat-label">Productos registrados</span>
                <strong>{loading ? '—' : formatNumber(products.length)}</strong>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat">
              <span className="admin-stat-icon"><i className="bi bi-stack" aria-hidden="true" /></span>
              <div>
                <span className="admin-stat-label">Unidades en stock</span>
                <strong>{loading ? '—' : formatNumber(stats.totalStock)}</strong>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat">
              <span className="admin-stat-icon"><i className="bi bi-cash-stack" aria-hidden="true" /></span>
              <div>
                <span className="admin-stat-label">Valor del inventario</span>
                <strong>{loading ? '—' : formatCurrency(stats.inventoryValue)}</strong>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat">
              <span className="admin-stat-icon admin-stat-icon-warning">
                <i className="bi bi-exclamation-triangle" aria-hidden="true" />
              </span>
              <div>
                <span className="admin-stat-label">Stock bajo o agotado</span>
                <strong>{loading ? '—' : formatNumber(stats.lowStock)}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        <div className="row g-4 g-xl-4">
          <div className="col-xl-5">
            {editInProgress && !editingProduct ? (
              loading ? (
                <div className="card border-0 shadow-sm">
                  <Loader compact label="Cargando producto a editar..." />
                </div>
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-search me-2" aria-hidden="true" />
                  No encontramos el producto que intentás editar.
                  <button type="button" className="btn btn-sm btn-outline-dark d-block mt-3" onClick={handleNewProduct}>
                    Crear un producto nuevo
                  </button>
                </div>
              )
            ) : (
              <ProductForm
                key={editingProduct ? `edit-${editingProduct.id}` : `new-${formVersion}`}
                initialValues={editingProduct}
                categories={categories}
                submitting={saving}
                onSubmit={handleSubmit}
                onCancel={editingProduct ? closeEditor : undefined}
              />
            )}
          </div>

          <div className="col-xl-7">
            <div className="card border-0 shadow-sm admin-list-card">
              <div className="card-header border-0 p-4 pb-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <h2 className="h4 mb-1">Inventario</h2>
                    <p className="text-secondary small mb-0">
                      {loading
                        ? 'Cargando productos...'
                        : `${filteredProducts.length} de ${products.length} productos`}
                    </p>
                  </div>
                  {editingProduct && (
                    <span className="badge text-bg-warning">
                      Editando: {editingProduct.name}
                    </span>
                  )}
                </div>
                <SearchBar
                  id="admin-search"
                  value={tableSearch}
                  onChange={setTableSearch}
                  placeholder="Buscar por nombre, marca, SKU o categoría..."
                />
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <Loader compact label="Consultando inventario..." />
                ) : filteredProducts.length === 0 ? (
                  <EmptyState
                    title="Sin productos para mostrar"
                    message={
                      products.length === 0
                        ? 'Todavía no hay productos en el catálogo. Creá el primero con el formulario.'
                        : 'No hay coincidencias con la búsqueda. Probá con otro término.'
                    }
                    action={
                      products.length === 0 ? (
                        <button type="button" className="btn btn-brand" onClick={handleNewProduct}>
                          Crear producto
                        </button>
                      ) : (
                        <button type="button" className="btn btn-outline-dark" onClick={() => setTableSearch('')}>
                          Limpiar búsqueda
                        </button>
                      )
                    }
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle admin-table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Producto</th>
                          <th scope="col">Categoría</th>
                          <th scope="col" className="text-end">Precio</th>
                          <th scope="col" className="text-center">Stock</th>
                          <th scope="col" className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => {
                          const stock = getStockState(product.stock)
                          const isBeingEdited =
                            editingProduct && String(editingProduct.id) === String(product.id)

                          return (
                            <tr key={product.id} className={isBeingEdited ? 'table-active' : ''}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={product.image || DEFAULT_IMAGE}
                                    alt=""
                                    className="admin-thumb"
                                    onError={imageFallback}
                                  />
                                  <div>
                                    <span className="fw-semibold d-block">
                                      {product.name}
                                      {product.featured && (
                                        <i className="bi bi-star-fill text-warning ms-1" aria-label="Destacado" />
                                      )}
                                    </span>
                                    <span className="text-secondary small">
                                      {product.brand ? `${product.brand} · ` : ''}
                                      {product.sku || `ID #${product.id}`}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-soft">{product.category}</span>
                              </td>
                              <td className="text-end fw-semibold">{formatCurrency(product.price)}</td>
                              <td className="text-center">
                                <span className={`badge ${stock.badge}`}>{product.stock}</span>
                              </td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm" role="group" aria-label={`Acciones para ${product.name}`}>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleEdit(product)}
                                    title="Editar"
                                    aria-label={`Editar ${product.name}`}
                                  >
                                    <i className="bi bi-pencil-square" aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => setProductToDelete(product)}
                                    title="Eliminar"
                                    aria-label={`Eliminar ${product.name}`}
                                  >
                                    <i className="bi bi-trash3" aria-hidden="true" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal
        show={Boolean(productToDelete)}
        title="Eliminar producto"
        message={
          productToDelete ? (
            <>
              ¿Seguro que querés eliminar <strong>{productToDelete.name}</strong>? Esta acción no se
              puede deshacer.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </>
  )
}

export default Admin
