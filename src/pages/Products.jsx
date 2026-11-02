import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../data/categories'

function Products() {
  const { products, loading, error, refetch } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('categoria') || ''

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const deferredSearch = useDeferredValue(search)

  const filteredProducts = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase()

    const result = products.filter((product) => {
      const matchesName = !term || product.name.toLowerCase().includes(term)
      const matchesCategory = !category || product.category === category
      return matchesName && matchesCategory
    })

    const sorted = [...result]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        break
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price))
        break
      default:
        break
    }

    return sorted
  }, [products, deferredSearch, category, sort])

  const hasFilters = Boolean(search || category) || sort !== 'default'

  const handleCategoryChange = (value) => {
    setSearchParams(value ? { categoria: value } : {}, { replace: true })
  }

  const clearFilters = () => {
    setSearch('')
    setSort('default')
    setSearchParams({}, { replace: true })
  }

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
                Productos
              </li>
            </ol>
          </nav>
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3">
            <div>
              <span className="section-kicker text-brand">Catálogo completo</span>
              <h1 className="display-5 fw-bold text-white mb-2">Todos los productos</h1>
              <p className="text-white-50 mb-0">
                Explorá el catálogo, filtrá por categoría y encontrá el hardware que necesitás.
              </p>
            </div>
            <span className="badge badge-soft-light align-self-start align-self-lg-end px-3 py-2">
              {loading ? 'Cargando...' : `${products.length} productos disponibles`}
            </span>
          </div>
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <div className="toolbar card border-0 shadow-sm p-3 p-lg-4 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-lg-6">
              <label className="form-label small fw-semibold" htmlFor="product-search">
                Buscar por nombre
              </label>
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="category-filter">
                Categoría
              </label>
              <select
                id="category-filter"
                className="form-select"
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
              >
                <option value="">Todas las categorías</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label small fw-semibold" htmlFor="sort-filter">
                Ordenar por
              </label>
              <select
                id="sort-filter"
                className="form-select"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="default">Destacados</option>
                <option value="name">Nombre (A-Z)</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>
          </div>
        </div>

        {loading && <Loader label="Consultando productos en JSON Server..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <p className="text-secondary mb-0" aria-live="polite">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong>{' '}
                productos
                {category && <span> en <strong>{category}</strong></span>}
              </p>
              {hasFilters && (
                <button type="button" className="btn btn-link btn-sm p-0" onClick={clearFilters}>
                  <i className="bi bi-x-circle me-1" aria-hidden="true" />
                  Limpiar filtros
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div className="col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message={
                  search
                    ? `No hay productos que coincidan con "${search}". Probá con otro término.`
                    : 'No hay productos disponibles en esta categoría.'
                }
                action={
                  <button type="button" className="btn btn-brand" onClick={clearFilters}>
                    Ver todos los productos
                  </button>
                }
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Products
