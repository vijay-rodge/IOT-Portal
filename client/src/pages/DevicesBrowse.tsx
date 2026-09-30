import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deviceService } from '../services/deviceService';
import { categoryService } from '../services/categoryService';
import { Device, Category, Pagination } from '../types';
import { DeviceCard } from '../components/device/DeviceCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export const DevicesBrowse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter state synced with URL query params
  const search = searchParams.get('search') || searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const protocol = searchParams.get('protocol') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const application = searchParams.get('application') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories on mount
  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch devices whenever query params change
  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const res = await deviceService.getDevices({
          search: search || undefined,
          category: category || undefined,
          protocol: protocol || undefined,
          difficulty: difficulty || undefined,
          application: application || undefined,
          sort,
          page,
          limit: 12,
        });

        setDevices(res.devices);
        setPagination(res.pagination);
      } catch (err) {
        console.error('Failed to load devices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [search, category, protocol, difficulty, application, sort, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const setPageNumber = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const protocolsList = ['I2C', 'SPI', 'UART', 'Wi-Fi', 'Bluetooth', '1-Wire', 'LoRa', 'CAN bus 2.0', 'PWM'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Browse IoT Hardware Catalog
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Search and filter across {pagination.total} cataloged microcontrollers, sensors, actuators, and communication modules.
          </p>
        </div>

        {/* Clear Filters Button */}
        {(search || category || protocol || difficulty || application) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Filter and Search Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search by name, spec, pin, or description..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name} ({cat.deviceCount})
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Options */}
        <div>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Sort: Newly Added</option>
            <option value="popular">Sort: Most Viewed / Popular</option>
            <option value="name-asc">Sort: Name (A to Z)</option>
            <option value="name-desc">Sort: Name (Z to A)</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>
      </div>

      {/* Protocol Quick-Chips Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider whitespace-nowrap mr-1">
          Protocols:
        </span>
        <button
          onClick={() => updateParam('protocol', '')}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            !protocol
              ? 'bg-brand-600 text-white dark:bg-brand-500'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {protocolsList.map((p) => (
          <button
            key={p}
            onClick={() => updateParam('protocol', protocol === p ? '' : p)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              protocol === p
                ? 'bg-brand-600 text-white dark:bg-brand-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {p}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 flex-shrink-0"></div>

        <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider whitespace-nowrap mr-1">
          Difficulty:
        </span>
        {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => updateParam('difficulty', difficulty === lvl ? '' : lvl)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              difficulty === lvl
                ? 'bg-brand-600 text-white dark:bg-brand-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 font-mono">
        Showing {devices.length} of {pagination.total} devices
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
        <div className="text-center py-20 p-8 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            No devices found matching your criteria.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search query, selecting another category, or clearing filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPageNumber(pagination.page - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPageNumber(pagination.page + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
