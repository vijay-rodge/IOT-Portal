import { api } from './api';
import { Device, Pagination } from '../types';

export interface GetDevicesParams {
  page?: number;
  limit?: number;
  category?: string;
  protocol?: string;
  interface?: string;
  application?: string;
  difficulty?: string;
  manufacturer?: string;
  tag?: string;
  search?: string;
  sort?: string;
  includeUnpublished?: boolean;
}

export const deviceService = {
  async getDevices(params: GetDevicesParams = {}): Promise<{ devices: Device[]; pagination: Pagination }> {
    const res = await api.get('/devices', { params });
    return res.data.data;
  },

  async getDeviceBySlug(slug: string): Promise<Device> {
    const res = await api.get(`/devices/${slug}`);
    return res.data.data.device;
  },

  async searchDevices(query: string): Promise<Device[]> {
    const res = await api.get('/devices/search', { params: { q: query } });
    return res.data.data.results;
  },

  async getFeaturedDevices(): Promise<Device[]> {
    const res = await api.get('/devices/featured');
    return res.data.data.devices;
  },

  async createDevice(deviceData: Partial<Device>): Promise<Device> {
    const res = await api.post('/devices', deviceData);
    return res.data.data.device;
  },

  async updateDevice(id: string, deviceData: Partial<Device>): Promise<Device> {
    const res = await api.put(`/devices/${id}`, deviceData);
    return res.data.data.device;
  },

  async deleteDevice(id: string): Promise<void> {
    await api.delete(`/devices/${id}`);
  },

  async togglePublish(id: string): Promise<boolean> {
    const res = await api.patch(`/devices/${id}/publish`);
    return res.data.data.published;
  },
};
