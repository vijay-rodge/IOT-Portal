import { api } from './api';
import { Category } from '../types';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const res = await api.get('/categories');
    return res.data.data.categories;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await api.get(`/categories/${slug}`);
    return res.data.data.category;
  },

  async createCategory(data: { name: string; description: string; icon?: string; order?: number }): Promise<Category> {
    const res = await api.post('/categories', data);
    return res.data.data.category;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
