import { api } from './api';
import { Device, User, Pagination } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const res = await api.get('/users/profile');
    return res.data.data.user;
  },

  async updateProfile(data: { name?: string; profileImage?: string }): Promise<User> {
    const res = await api.put('/users/profile', data);
    return res.data.data.user;
  },

  async getBookmarks(): Promise<Device[]> {
    const res = await api.get('/users/bookmarks');
    return res.data.data.bookmarks;
  },

  async addBookmark(deviceId: string): Promise<number> {
    const res = await api.post(`/users/bookmarks/${deviceId}`);
    return res.data.data.bookmarksCount;
  },

  async removeBookmark(deviceId: string): Promise<number> {
    const res = await api.delete(`/users/bookmarks/${deviceId}`);
    return res.data.data.bookmarksCount;
  },

  async getRecentlyViewed(): Promise<Array<{ device: Device; viewedAt: string }>> {
    const res = await api.get('/users/recently-viewed');
    return res.data.data.recentlyViewed;
  },

  async recordRecentlyViewed(deviceId: string): Promise<void> {
    await api.post(`/users/recently-viewed/${deviceId}`);
  },

  async getAllUsers(page = 1, limit = 20, search = ''): Promise<{ users: User[]; pagination: Pagination }> {
    const res = await api.get('/users/admin/all', { params: { page, limit, search } });
    return res.data.data;
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    const res = await api.put(`/users/admin/${id}/role`, { role });
    return res.data.data.user;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/admin/${id}`);
  },
};
