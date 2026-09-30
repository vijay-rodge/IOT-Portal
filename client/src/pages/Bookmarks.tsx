import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { Device } from '../types';
import { DeviceCard } from '../components/device/DeviceCard';
import { Bookmark, ChevronLeft, Search } from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Device[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await userService.getBookmarks();
        setBookmarks(data);
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (deviceId: string, bookmarked: boolean) => {
    if (!bookmarked) {
      setBookmarks((prev) => prev.filter((d) => d._id !== deviceId));
    }
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-amber-500" />
            <span>My Saved Hardware Bookmarks</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            You have {bookmarks.length} saved devices in your personal technical library.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            No Saved Devices Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Bookmark devices while exploring our catalog to assemble your custom IoT hardware stack.
          </p>
          <Link
            to="/devices"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all inline-block"
          >
            Explore Hardware Catalog
          </Link>
        </div>
      )}
    </div>
  );
};
