import api from './axios'

export const adminApi = {
  listProviders: (params) => api.get('/admin/providers', { params }),
  approveProvider: (id) => api.patch(`/admin/providers/${id}/approve`),
  rejectProvider: (id) => api.patch(`/admin/providers/${id}/reject`),
  getAnalytics: () => api.get('/admin/analytics'),
  getReviews: () => api.get('/admin/reviews'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
}
