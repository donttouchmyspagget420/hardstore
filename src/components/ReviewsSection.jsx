import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useReviews } from '../hooks/useReviews'
import { formatDate, getInitials } from '../utils/format'
import StarRating from './StarRating'
import ConfirmModal from './ConfirmModal'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

const EMPTY_FORM = {
  rating: 5,
  comment: '',
}

function ReviewsSection({ productId, productName }) {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { showToast } = useToast()
  const { reviews, loading, error, refetch, createReview, removeReview, voteReview } =
    useReviews(productId)

  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const stats = useMemo(() => {
    const total = reviews.length
    const average = total
      ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / total
      : 0

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => Number(review.rating) === rating).length
      return {
        rating,
        count,
        percent: total ? Math.round((count / total) * 100) : 0,
      }
    })

    return { total, average, distribution }
  }, [reviews])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.comment.trim() || form.comment.trim().length < 10) {
      setFormError('Escribí un comentario de al menos 10 caracteres.')
      return
    }

    setSubmitting(true)
    try {
      await createReview({
        productId: Number(productId) || productId,
        productName,
        userId: user.id,
        userName: user.name,
        rating: form.rating,
        comment: form.comment.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      })
      setForm(EMPTY_FORM)
      showToast('Tu opinión se publicó correctamente.', 'success', '¡Gracias por comentar!')
    } catch (submitError) {
      showToast(submitError.message, 'danger', 'No se pudo publicar la opinión')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (review, vote) => {
    if (!isAuthenticated) {
      showToast('Iniciá sesión para votar una opinión.', 'info', 'Necesitás una cuenta')
      return
    }

    try {
      await voteReview(review.id, user.id, vote)
    } catch (voteError) {
      showToast(voteError.message, 'danger', 'No se pudo registrar tu voto')
    }
  }

  const handleDelete = async () => {
    if (!reviewToDelete) return

    setDeleting(true)
    try {
      await removeReview(reviewToDelete.id)
      showToast('La opinión se eliminó.', 'success', 'Opinión eliminada')
      setReviewToDelete(null)
    } catch (deleteError) {
      showToast(deleteError.message, 'danger', 'No se pudo eliminar la opinión')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="reviews-section mt-5" id="opiniones">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <span className="section-kicker">Opiniones verificadas</span>
          <h2 className="h3 mt-1 mb-0">Lo que dice la comunidad</h2>
        </div>
        <span className="badge badge-soft">
          <i className="bi bi-chat-square-text me-1" aria-hidden="true" />
          {stats.total} {stats.total === 1 ? 'opinión' : 'opiniones'}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="review-summary card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="review-score">
                {stats.average.toFixed(1)}
                <span>/ 5</span>
              </div>
              <StarRating value={stats.average} size="lg" />
              <p className="text-secondary small mt-2 mb-4">
                Promedio de {stats.total} {stats.total === 1 ? 'calificación' : 'calificaciones'}
              </p>

              <div className="review-distribution">
                {stats.distribution.map((item) => (
                  <div className="review-distribution-row" key={item.rating}>
                    <span>{item.rating}</span>
                    <i className="bi bi-star-fill" aria-hidden="true" />
                    <div className="progress" role="progressbar" aria-label={`${item.rating} estrellas`} aria-valuenow={item.percent} aria-valuemin="0" aria-valuemax="100">
                      <div className="progress-bar" style={{ width: `${item.percent}%` }} />
                    </div>
                    <span className="review-distribution-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {isAuthenticated ? (
            <form className="card border-0 shadow-sm review-form" onSubmit={handleSubmit} noValidate>
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <h3 className="h5 mb-0">Dejá tu opinión sobre {productName}</h3>
                  <span className="small text-secondary">Publicás como {user.name}</span>
                </div>

                <div className="mb-3">
                  <span className="form-label d-block">Tu calificación</span>
                  <StarRating
                    value={form.rating}
                    onChange={(rating) => setForm((current) => ({ ...current, rating }))}
                    size="lg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="review-comment">
                    Comentario
                  </label>
                  <textarea
                    id="review-comment"
                    className={`form-control${formError ? ' is-invalid' : ''}`}
                    rows="3"
                    value={form.comment}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, comment: event.target.value }))
                      setFormError('')
                    }}
                    placeholder="Contá tu experiencia con el producto..."
                    maxLength="500"
                  />
                  {formError && <div className="invalid-feedback">{formError}</div>}
                  <div className="form-text text-end">{form.comment.length}/500</div>
                </div>

                <button type="submit" className="btn btn-brand" disabled={submitting}>
                  {submitting && (
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  )}
                  <i className="bi bi-send me-1" aria-hidden="true" />
                  Publicar opinión
                </button>
              </div>
            </form>
          ) : (
            <div className="card border-0 shadow-sm review-login">
              <div className="card-body p-4 d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                <span className="status-icon status-icon-success flex-shrink-0">
                  <i className="bi bi-person-lock" aria-hidden="true" />
                </span>
                <div className="flex-grow-1">
                  <h3 className="h5 mb-1">¿Probaste este producto?</h3>
                  <p className="text-secondary small mb-0">
                    Iniciá sesión para dejar tu comentario, calificarlo y votar las opiniones de
                    otros usuarios.
                  </p>
                </div>
                <Link
                  className="btn btn-outline-dark flex-shrink-0"
                  to="/login"
                  state={{ from: { pathname: `/productos/${productId}` } }}
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          )}

          <div className="mt-4">
            {loading && <Loader compact label="Cargando opiniones..." />}
            {error && <ErrorMessage message={error} onRetry={refetch} />}

            {!loading && !error && reviews.length === 0 && (
              <div className="empty-state text-center py-4">
                <span className="empty-state-icon mb-2">
                  <i className="bi bi-chat-square-dots" aria-hidden="true" />
                </span>
                <p className="text-secondary mb-0">
                  Todavía no hay opiniones de este producto. ¡Sé el primero en comentar!
                </p>
              </div>
            )}

            {!loading && !error && reviews.length > 0 && (
              <div className="review-list">
                {reviews.map((review) => {
                  const liked = user ? (review.likedBy || []).includes(user.id) : false
                  const disliked = user ? (review.dislikedBy || []).includes(user.id) : false
                  const canDelete = isAdmin || review.userId === user?.id

                  return (
                    <article className="review-item" key={review.id}>
                      <div className="review-avatar" aria-hidden="true">
                        {getInitials(review.userName) || 'U'}
                      </div>
                      <div className="review-body">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <strong>{review.userName}</strong>
                          {review.userId === user?.id && (
                            <span className="badge badge-soft">Tu opinión</span>
                          )}
                          <span className="text-secondary small ms-sm-auto">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <StarRating value={Number(review.rating) || 0} size="sm" />
                        <p className="review-comment mb-2">{review.comment}</p>

                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm review-vote${liked ? ' is-active' : ''}`}
                            onClick={() => handleVote(review, 'like')}
                            aria-pressed={liked}
                            aria-label={`Me gusta esta opinión (${review.likes || 0})`}
                          >
                            <i className={`bi ${liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" />
                            {review.likes || 0}
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm review-vote${disliked ? ' is-active-danger' : ''}`}
                            onClick={() => handleVote(review, 'dislike')}
                            aria-pressed={disliked}
                            aria-label={`No me gusta esta opinión (${review.dislikes || 0})`}
                          >
                            <i className={`bi ${disliked ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}`} aria-hidden="true" />
                            {review.dislikes || 0}
                          </button>

                          {canDelete && (
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger ms-auto p-0"
                              onClick={() => setReviewToDelete(review)}
                            >
                              <i className="bi bi-trash3 me-1" aria-hidden="true" />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        show={Boolean(reviewToDelete)}
        title="Eliminar opinión"
        message={
          reviewToDelete ? (
            <>
              ¿Seguro que querés eliminar la opinión de{' '}
              <strong>{reviewToDelete.userName}</strong>? Esta acción no se puede deshacer.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </section>
  )
}

export default ReviewsSection
