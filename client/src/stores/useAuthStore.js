import { create } from 'zustand'
import { authApi } from '../api/auth'
import { setToken, getToken, removeToken } from '../utils/storage'

const useAuthStore = create((set) => ({
  user: null,
  token: getToken(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const { data } = await authApi.login({ email: normalizedEmail, password })
      setToken(data.token)
      set({ user: data.data, token: data.token, isLoading: false })
      return data.data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request ? 'Unable to reach server. Please try again.' : 'Login failed')
      set({ error: message, isLoading: false })
      throw err
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const payload = {
        ...userData,
        name: userData.name?.trim(),
        city: userData.city?.trim(),
        email: userData.email?.trim().toLowerCase(),
      }
      const { data } = await authApi.register(payload)
      setToken(data.token)
      set({ user: data.data, token: data.token, isLoading: false })
      return data.data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request
          ? 'Unable to reach server. Please try again.'
          : 'Registration failed')
      set({ error: message, isLoading: false })
      throw err
    }
  },

  fetchMe: async () => {
    set({ isLoading: true })
    try {
      const { data } = await authApi.getMe()
      set({ user: data.data, isLoading: false })
    } catch {
      removeToken()
      set({ user: null, token: null, isLoading: false })
    }
  },

  logout: () => {
    removeToken()
    set({ user: null, token: null, error: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
