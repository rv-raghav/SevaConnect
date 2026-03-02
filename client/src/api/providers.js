import api from './axios'

export const providersApi = {
  getProviders: (params) => api.get('/providers', { params }),
  getMyProfile: () => api.get('/provider/profile'),
  createOrUpdateProfile: (data) => api.post('/provider/profile', data),
}
