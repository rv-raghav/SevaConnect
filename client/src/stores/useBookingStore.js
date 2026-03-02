import { create } from 'zustand'
import { bookingsApi } from '../api/bookings'

const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,
  pagination: { page: 1, pages: 1, total: 0 },
  statusFilter: '',
  isLoading: false,

  fetchMyBookings: async (params = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await bookingsApi.getMyBookings(params)
      set({
        bookings: data.data.bookings,
        pagination: { page: data.data.page, pages: data.data.pages, total: data.data.total },
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchProviderBookings: async (params = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await bookingsApi.getProviderBookings(params)
      set({
        bookings: data.data.bookings,
        pagination: { page: data.data.page, pages: data.data.pages, total: data.data.total },
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchBookingById: async (id) => {
    set({ isLoading: true })
    try {
      const { data } = await bookingsApi.getBookingById(id)
      set({ currentBooking: data.data, isLoading: false })
      return data.data
    } catch {
      set({ isLoading: false })
    }
  },

  setStatusFilter: (status) => set({ statusFilter: status }),
  setPage: (page) => set((s) => ({ pagination: { ...s.pagination, page } })),
  clearBookings: () => set({ bookings: [], pagination: { page: 1, pages: 1, total: 0 } }),
}))

export default useBookingStore
