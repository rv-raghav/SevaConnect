import { create } from 'zustand'
import { categoriesApi } from '../api/categories'

const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true })
    try {
      const { data } = await categoriesApi.getAllCategories()
      set({ categories: data.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

export default useCategoryStore
