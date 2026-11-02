import { useCallback, useEffect, useState } from 'react'
import { reviewApi } from '../services/api'

/**
 * Hook para las reseñas de un producto. Si productId es null/undefined,
 * devuelve todas las reseñas (se usa en el perfil del usuario).
 */
export function useReviews(productId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    const request = productId == null ? reviewApi.getAll() : reviewApi.getByProduct(productId)

    request
      .then((data) => {
        if (active) {
          setReviews(Array.isArray(data) ? data : [])
          setError(null)
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId, reloadToken])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  const createReview = useCallback(async (review) => {
    const created = await reviewApi.create(review)
    setReviews((current) => [created, ...current])
    return created
  }, [])

  const removeReview = useCallback(async (id) => {
    await reviewApi.remove(id)
    setReviews((current) => current.filter((review) => String(review.id) !== String(id)))
  }, [])

  const voteReview = useCallback(async (reviewId, userId, vote) => {
    const target = reviews.find((review) => String(review.id) === String(reviewId))
    if (!target) return null

    const likedBy = Array.isArray(target.likedBy) ? target.likedBy : []
    const dislikedBy = Array.isArray(target.dislikedBy) ? target.dislikedBy : []
    const alreadyLiked = likedBy.includes(userId)
    const alreadyDisliked = dislikedBy.includes(userId)

    const nextLikedBy = likedBy.filter((id) => id !== userId)
    const nextDislikedBy = dislikedBy.filter((id) => id !== userId)

    if (vote === 'like' && !alreadyLiked) nextLikedBy.push(userId)
    if (vote === 'dislike' && !alreadyDisliked) nextDislikedBy.push(userId)

    const nextReview = {
      ...target,
      likedBy: nextLikedBy,
      dislikedBy: nextDislikedBy,
      likes: nextLikedBy.length,
      dislikes: nextDislikedBy.length,
    }

    setReviews((current) =>
      current.map((review) => (String(review.id) === String(reviewId) ? nextReview : review)),
    )

    try {
      const updated = await reviewApi.update(reviewId, {
        likedBy: nextReview.likedBy,
        dislikedBy: nextReview.dislikedBy,
        likes: nextReview.likes,
        dislikes: nextReview.dislikes,
      })

      setReviews((current) =>
        current.map((review) => (String(review.id) === String(reviewId) ? updated : review)),
      )
      return updated
    } catch (voteError) {
      refetch()
      throw voteError
    }
  }, [reviews, refetch])

  return {
    reviews,
    loading,
    error,
    refetch,
    createReview,
    removeReview,
    voteReview,
  }
}
