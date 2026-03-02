import api from './axios'

export const reviewsApi = {
  createReview: (data) => api.post('/reviews', data),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
}
