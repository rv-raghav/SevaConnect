import api from './axios'

export const providersApi = {
  getProviders: (params) => api.get('/providers', { params }),
  getProviderById: (id) => api.get(`/providers/${id}`),
  getMyProfile: () => api.get('/provider/profile'),
  createOrUpdateProfile: (data) => api.post('/provider/profile', data),
  getProviderStats: () => api.get('/provider/stats'),
}
