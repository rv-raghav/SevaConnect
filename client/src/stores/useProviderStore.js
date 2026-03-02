import { create } from 'zustand'
import { providersApi } from '../api/providers'

const useProviderStore = create((set) => ({
  providers: [],
  myProfile: null,
  isLoading: false,

  fetchProviders: async (params = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await providersApi.getProviders(params)
      set({ providers: data.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchMyProfile: async () => {
    set({ isLoading: true })
    try {
      const { data } = await providersApi.getMyProfile()
      set({ myProfile: data.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

export default useProviderStore
