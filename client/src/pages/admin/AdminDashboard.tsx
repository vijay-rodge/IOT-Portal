import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import { deviceService } from '../../services/deviceService';
import { PlatformStats, Device } from '../../types';
import {
  Shield,
  Cpu,
  Users,
  Layers,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await statsService.getOverviewStats();
      setStatsData(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      await deviceService.togglePublish(id);
      await fetchStats();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Loading administrative platform analytics...</p>
      </div>
    );
  }

  const { stats, protocolCounts, difficultyCounts, recentDevices, popularDevices } = statsData || {
    stats: { totalUsers: 0, totalDevices: 0, publishedDevices: 0, draftDevices: 0, totalCategories: 0 },
    protocolCounts: [],
    difficultyCounts: [],
    recentDevices: [],
    popularDevices: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Shield className="w-3 h-3" /> System Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Admin Management Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor platform health, manage IoT catalog entries, categories, and system permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/devices/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Device</span>
          </Link>
          <Link
            to="/admin/devices"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <span>Manage Devices</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <span>Users</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Devices</span>
            <Cpu className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.totalDevices}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {stats.publishedDevices} Published ({stats.draftDevices} Draft)
          </span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.totalCategories}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Across 18 taxonomies
          </span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.totalUsers}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Registered accounts
          </span>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">System State</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            Healthy
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            MongoDB Connected
          </span>
        </div>
      </div>

      {/* Distribution Charts / Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protocol Counts */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Communication Protocols Distribution
          </h3>
          <div className="space-y-3">
            {protocolCounts.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{item.protocol}</span>
                  <span className="text-slate-500 font-mono">{item.count} Devices</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((item.count / (stats.totalDevices || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Counts */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Hardware Learning Difficulty
          </h3>
          <div className="space-y-4">
            {difficultyCounts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.level} Level</h4>
                  <span className="text-xs text-slate-500">Suitable for tutorials & projects</span>
                </div>
                <span className="text-lg font-extrabold font-mono text-brand-600 dark:text-brand-400">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Devices Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recently Added Hardware Catalog Entries
          </h3>
          <Link
            to="/admin/devices"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View all devices →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Device Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDevices.map((dev) => (
                <tr key={dev._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    <Link to={`/devices/${dev.slug}`} className="hover:text-brand-500">
                      {dev.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {(dev.category as any)?.name || 'General'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                      {dev.difficultyLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublish(dev._id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        dev.published
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {dev.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/devices/${dev._id}/edit`}
                      className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-500"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
