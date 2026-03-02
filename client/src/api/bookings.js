import api from './axios'

export const bookingsApi = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getProviderBookings: (params) => api.get('/provider/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  rescheduleBooking: (id, data) => api.patch(`/bookings/${id}/reschedule`, data),
  acceptBooking: (id) => api.patch(`/bookings/${id}/accept`),
  startBooking: (id) => api.patch(`/bookings/${id}/start`),
  completeBooking: (id) => api.patch(`/bookings/${id}/complete`),
  addWorkUpdate: (id, formData, type) =>
    api.post(`/bookings/${id}/work?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
