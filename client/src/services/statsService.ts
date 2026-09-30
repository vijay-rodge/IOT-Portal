import { api } from './api';
import { PlatformStats } from '../types';

export const statsService = {
  async getOverviewStats(): Promise<PlatformStats> {
    const res = await api.get('/stats/overview');
    return res.data.data;
  },
};
