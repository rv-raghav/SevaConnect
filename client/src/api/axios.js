import axios from 'axios'
import { getToken, removeToken } from '../utils/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      // Don't force redirect for /auth/me — let the auth store handle it gracefully
      if (!url.includes('/auth/me')) {
        removeToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
