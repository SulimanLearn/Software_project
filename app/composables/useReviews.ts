type ApiPerson = {
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
}

export type ApiReview = {
  id: number
  patient_id: number
  doctor_id: number
  rating: number
  comment?: string
  review?: string
  created_at?: string
  updated_at?: string
  patient?: ApiPerson
  doctor?: ApiPerson
}

export type DoctorReviewsResponse = {
  doctor_id: number
  average_rating: number
  total_reviews: number
  reviews: ApiReview[]
}

export type ReviewPayload = {
  patient_id: number
  doctor_id: number
  rating: number
  comment: string
}

export const useReviews = () => {
  const { authFetch } = useAuth()

  const fetchReviews = () => authFetch<{ reviews: ApiReview[] }>('/reviews')

  const fetchDoctorReviews = (doctorId: string | number) => (
    authFetch<DoctorReviewsResponse>(`/doctors/${doctorId}/reviews`)
  )

  const createReview = (payload: ReviewPayload) => (
    authFetch<{ message: string; review: ApiReview }>('/reviews', {
      method: 'POST',
      body: payload,
    })
  )

  const updateReview = (reviewId: string | number, payload: ReviewPayload) => (
    authFetch<{ message: string; review: ApiReview }>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: payload,
    })
  )

  const deleteReview = (reviewId: string | number, patientId: number) => (
    authFetch<{ message: string }>(`/reviews/${reviewId}`, {
      method: 'DELETE',
      body: { patient_id: patientId },
    })
  )

  return {
    fetchReviews,
    fetchDoctorReviews,
    createReview,
    updateReview,
    deleteReview,
  }
}
