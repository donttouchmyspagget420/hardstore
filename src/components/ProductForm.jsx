import { useId, useState } from 'react'
import { CATEGORIES, DEFAULT_IMAGE } from '../data/categories'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: CATEGORIES[0],
  stock: '',
  image: '/images/notebook.svg',
  brand: '',
  sku: '',
  warranty: '12 meses',
  featured: false,
  longDescription: '',
  highlights: '',
  specs: '',
}

function toTextLines(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function specsToText(specs) {
  if (!specs || typeof specs !== 'object') return ''
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

function toFormValues(product) {
  if (!product) return { ...EMPTY_FORM }

  return {
    name: product.name ?? '',
    description: product.description ?? '',
    price: product.price != null ? String(product.price) : '',
    category: product.category || CATEGORIES[0],
    stock: product.stock != null ? String(product.stock) : '',
    image: product.image || DEFAULT_IMAGE,
    brand: product.brand ?? '',
    sku: product.sku ?? '',
    warranty: product.warranty ?? '12 meses',
    featured: Boolean(product.featured),
    longDescription: product.longDescription ?? '',
    highlights: toTextLines(product.highlights),
    specs: specsToText(product.specs),
  }
}

function parseLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseSpecs(value) {
  return parseLines(value).reduce((result, line) => {
    const separator = line.indexOf(':')
    if (separator <= 0) return result

    const key = line.slice(0, separator).trim()
    const specValue = line.slice(separator + 1).trim()
    if (key && specValue) result[key] = specValue
    return result
  }, {})
}

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 3) {
    errors.name = 'Ingresá un nombre de al menos 3 caracteres.'
  }

  if (values.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres.'
  }

  const price = Number(values.price)
  if (!values.price || !Number.isFinite(price) || price <= 0) {
    errors.price = 'El precio debe ser un número mayor a 0.'
  }

  if (!values.category) {
    errors.category = 'Seleccioná una categoría.'
  }

  const stock = Number(values.stock)
  if (values.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a 0.'
  }

  if (!values.image.trim()) {
    errors.image = 'Indicá la ruta o URL de la imagen.'
  }

  return errors
}

function ProductForm({ initialValues = null, submitting = false, onSubmit, onCancel }) {
  const formId = useId()
  const [form, setForm] = useState(() => toFormValues(initialValues))
  const [errors, setErrors] = useState({})
  const [imageFailed, setImageFailed] = useState(false)

  const isEditing = Boolean(initialValues)
  const previewSrc = imageFailed ? DEFAULT_IMAGE : form.image.trim() || DEFAULT_IMAGE

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    if (name === 'image') setImageFailed(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validate(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      image: form.image.trim(),
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      warranty: form.warranty.trim(),
      featured: form.featured,
      longDescription: form.longDescription.trim(),
      highlights: parseLines(form.highlights),
      specs: parseSpecs(form.specs),
    })
  }

  const fieldClass = (name) => `form-control${errors[name] ? ' is-invalid' : ''}`

  return (
    <form className="card border-0 shadow-sm product-form" onSubmit={handleSubmit} noValidate>
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">{isEditing ? 'Editar producto' : 'Nuevo producto'}</h2>
            <p className="text-secondary small mb-0">
              {isEditing
                ? 'Modificá los datos y guardá los cambios.'
                : 'Completá los datos para agregar un producto al catálogo.'}
            </p>
          </div>
          <span className={`badge ${isEditing ? 'text-bg-warning' : 'text-bg-success'}`}>
            {isEditing ? 'Editando' : 'Crear'}
          </span>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor={`${formId}-name`}>
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            name="name"
            className={fieldClass('name')}
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Notebook Gamer Nova 15"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor={`${formId}-description`}>
            Descripción corta <span className="text-danger">*</span>
          </label>
          <textarea
            id={`${formId}-description`}
            name="description"
            rows="3"
            className={fieldClass('description')}
            value={form.description}
            onChange={handleChange}
            placeholder="Características principales del producto..."
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <label className="form-label" htmlFor={`${formId}-price`}>
              Precio (USD) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                id={`${formId}-price`}
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                className={fieldClass('price')}
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor={`${formId}-stock`}>
              Stock <span className="text-danger">*</span>
            </label>
            <input
              id={`${formId}-stock`}
              type="number"
              name="stock"
              min="0"
              step="1"
              className={fieldClass('stock')}
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
            />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor={`${formId}-category`}>
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-category`}
            name="category"
            className={`form-select${errors.category ? ' is-invalid' : ''}`}
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor={`${formId}-image`}>
            Imagen (ruta o URL) <span className="text-danger">*</span>
          </label>
          <input
            id={`${formId}-image`}
            type="text"
            name="image"
            className={fieldClass('image')}
            value={form.image}
            onChange={handleChange}
            placeholder="https://... o /images/notebook.svg"
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          <div className="form-text">
            Podés usar una imagen local de <code>/public/images</code> o una URL externa.
          </div>
        </div>

        <div className="image-preview mb-4">
          <img
            src={previewSrc}
            alt="Vista previa del producto"
            onError={() => setImageFailed(true)}
          />
          <div>
            <span className="d-block fw-semibold small">Vista previa</span>
            <span className="text-secondary small">Así se verá la imagen del producto.</span>
          </div>
        </div>

        <details className="form-extra" open={isEditing}>
          <summary>
            <i className="bi bi-card-text me-2" aria-hidden="true" />
            Información ampliada
            <span className="form-extra-hint">Marca, ficha técnica y descripción larga</span>
          </summary>

          <div className="row g-3 mt-1 mb-3">
            <div className="col-sm-6">
              <label className="form-label" htmlFor={`${formId}-brand`}>
                Marca
              </label>
              <input
                id={`${formId}-brand`}
                type="text"
                name="brand"
                className="form-control"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ej: NovaTech"
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label" htmlFor={`${formId}-sku`}>
                SKU
              </label>
              <input
                id={`${formId}-sku`}
                type="text"
                name="sku"
                className="form-control"
                value={form.sku}
                onChange={handleChange}
                placeholder="HS-NB-019"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor={`${formId}-warranty`}>
              Garantía
            </label>
            <input
              id={`${formId}-warranty`}
              type="text"
              name="warranty"
              className="form-control"
              value={form.warranty}
              onChange={handleChange}
              placeholder="12 meses"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor={`${formId}-longDescription`}>
              Descripción larga
            </label>
            <textarea
              id={`${formId}-longDescription`}
              name="longDescription"
              rows="4"
              className="form-control"
              value={form.longDescription}
              onChange={handleChange}
              placeholder="Contá con más detalle para qué sirve y qué incluye el producto..."
            />
            <div className="form-text">
              Separá los párrafos con un salto de línea para mostrarlos en bloques.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor={`${formId}-highlights`}>
              Puntos destacados
            </label>
            <textarea
              id={`${formId}-highlights`}
              name="highlights"
              rows="4"
              className="form-control"
              value={form.highlights}
              onChange={handleChange}
              placeholder={'Procesador de 8 núcleos\nPantalla de 165 Hz\nSSD de 512 GB'}
            />
            <div className="form-text">Un beneficio por línea.</div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor={`${formId}-specs`}>
              Especificaciones técnicas
            </label>
            <textarea
              id={`${formId}-specs`}
              name="specs"
              rows="5"
              className="form-control"
              value={form.specs}
              onChange={handleChange}
              placeholder={'Procesador: AMD Ryzen 7\nMemoria: 16 GB DDR5\nAlmacenamiento: SSD 512 GB'}
            />
            <div className="form-text">Formato: <code>Clave: valor</code>, una por línea.</div>
          </div>

          <div className="form-check form-switch mb-2">
            <input
              id={`${formId}-featured`}
              type="checkbox"
              name="featured"
              className="form-check-input"
              checked={form.featured}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={`${formId}-featured`}>
              Mostrar como producto destacado
            </label>
          </div>
        </details>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <button type="submit" className="btn btn-brand flex-grow-1" disabled={submitting}>
            {submitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
            <i className={`bi ${isEditing ? 'bi-check2-circle' : 'bi-plus-circle'} me-1`} aria-hidden="true" />
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={submitting}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default ProductForm
