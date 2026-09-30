import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { deviceService } from '../services/deviceService';
import { Category, Device, Pagination } from '../types';
import { DeviceCard } from '../components/device/DeviceCard';
import { Search, ChevronLeft, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export const CategoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [protocol, setProtocol] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndDevices = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const cat = await categoryService.getCategoryBySlug(slug);
        setCategory(cat);

        const devRes = await deviceService.getDevices({
          category: slug,
          search: search || undefined,
          difficulty: difficulty || undefined,
          protocol: protocol || undefined,
          limit: 12,
        });

        setDevices(devRes.devices);
        setPagination(devRes.pagination);
      } catch (err) {
        console.error('Failed to load category devices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndDevices();
  }, [slug, search, difficulty, protocol]);

  if (!category && !isLoading) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold mb-2">Category Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">The requested category slug does not exist.</p>
        <Link to="/categories" className="text-brand-600 font-semibold hover:underline">
          Return to Categories Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Category Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold mb-3">
            <span>Hardware Category</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {category?.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
            {category?.description}
          </p>
          <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
            <span>{pagination.total} Devices Cataloged</span>
          </div>
        </div>
      </div>

      {/* In-category Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search inside category */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search within ${category?.name || 'category'}...`}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Protocols</option>
            <option value="I2C">I2C</option>
            <option value="SPI">SPI</option>
            <option value="UART">UART</option>
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="Bluetooth">Bluetooth</option>
            <option value="1-Wire">1-Wire</option>
            <option value="LoRa">LoRa</option>
          </select>
        </div>
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard key={device._id} device={device} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
          <p className="text-sm text-slate-500">No devices found matching your current filter criteria in this category.</p>
        </div>
      )}
    </div>
  );
};
