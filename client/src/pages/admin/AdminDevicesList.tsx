import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { categoryService } from '../../services/categoryService';
import { Device, Category, Pagination } from '../../types';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const AdminDevicesList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal deletion state
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDevices = async (page = 1) => {
    setIsLoading(true);
    try {
      const [devData, catData] = await Promise.all([
        deviceService.getDevices({
          search: search || undefined,
          category: selectedCategory || undefined,
          page,
          limit: 15,
          includeUnpublished: true,
        }),
        categories.length === 0 ? categoryService.getAllCategories() : Promise.resolve(categories),
      ]);

      setDevices(devData.devices);
      setPagination(devData.pagination);
      if (categories.length === 0) setCategories(catData);
    } catch (err) {
      console.error('Failed to load devices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices(1);
  }, [search, selectedCategory]);

  const handleTogglePublish = async (id: string) => {
    try {
      await deviceService.togglePublish(id);
      fetchDevices(pagination.page);
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const confirmDelete = async () => {
    if (!deviceToDelete) return;
    setIsDeleting(true);
    try {
      await deviceService.deleteDevice(deviceToDelete._id);
      setDeviceToDelete(null);
      fetchDevices(pagination.page);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Manage IoT Devices
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, edit, publish, or remove hardware entries in the portal reference catalog.
          </p>
        </div>

        <Link
          to="/admin/devices/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Device</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices by name or manufacturer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Device Name & Slug</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Voltage</th>
              <th className="py-3.5 px-4">Protocols</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Publish State</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  Loading catalog devices...
                </td>
              </tr>
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <tr key={device._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {device.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      /{device.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {(device.category as any)?.name || 'General'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {device.voltage || '3.3V – 5V'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {device.communicationProtocols?.slice(0, 2).map((p, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                      {device.difficultyLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(device._id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        device.published
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {device.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/devices/${device.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                      title="View Live Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/admin/devices/${device._id}/edit`}
                      className="inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400"
                      title="Edit Device"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => setDeviceToDelete(device)}
                      className="inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      title="Delete Device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No devices found. Click "Add New Device" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchDevices(pagination.page - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchDevices(pagination.page + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal (Section 17) */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Device?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  "{deviceToDelete.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeviceToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
