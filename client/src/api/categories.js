import api from './axios'

export const categoriesApi = {
  getAllCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
}
