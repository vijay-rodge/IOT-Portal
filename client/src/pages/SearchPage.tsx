import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { deviceService } from '../services/deviceService';
import { Device } from '../types';
import { DeviceCard } from '../components/device/DeviceCard';
import { Search, ChevronLeft } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputVal, setInputVal] = useState(query);

  useEffect(() => {
    setInputVal(query);
    const executeSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await deviceService.searchDevices(query);
        setResults(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: inputVal.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/devices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Hardware Devices</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Search Results
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {query ? (
              <>Showing results for <span className="font-semibold text-slate-900 dark:text-white">"{query}"</span></>
            ) : (
              'Enter a hardware keyword to search specifications, names, and protocols.'
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search IoT hardware..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((device) => (
            <DeviceCard key={device._id} device={device} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 p-8 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            No devices matched your query.
          </p>
          <p className="text-xs text-slate-500">
            Try searching for common terms like "temperature", "relay", "I2C", "Wi-Fi", "ESP32", or "motor".
          </p>
        </div>
      )}
    </div>
  );
};
