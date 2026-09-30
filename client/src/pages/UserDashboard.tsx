import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Device, RecentlyViewedItem } from '../types';
import { DeviceCard } from '../components/device/DeviceCard';
import {
  Layers,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [bookmarks, setBookmarks] = useState<Device[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [saved, recent] = await Promise.all([
          userService.getBookmarks(),
          userService.getRecentlyViewed(),
        ]);
        setBookmarks(saved);
        setRecentlyViewed(recent);
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBookmarkToggle = (deviceId: string, bookmarked: boolean) => {
    if (!bookmarked) {
      setBookmarks((prev) => prev.filter((d) => d._id !== deviceId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Student & Developer Workspace
              </span>
              {isAdmin && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your bookmarked hardware devices, pick up where you left off from your recently viewed history, and explore new IoT modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/devices"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              <span>Explore Hardware</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Saved Bookmarks
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {bookmarks.length}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Recently Viewed
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {recentlyViewed.length}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Account Status
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Verified Student
            </span>
          </div>
        </div>
      </div>

      {/* Bookmarked Devices Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              <span>Bookmarked IoT Hardware</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quick access to your saved references and datasheets.
            </p>
          </div>
          {bookmarks.length > 0 && (
            <Link
              to="/bookmarks"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All ({bookmarks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.slice(0, 3).map((device) => (
              <DeviceCard
                key={device._id}
                device={device}
                isBookmarked={true}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No bookmarked devices yet
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Click the bookmark icon on any device card to save it for quick reference.
            </p>
            <Link
              to="/devices"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold inline-block"
            >
              Browse Hardware Catalog
            </Link>
          </div>
        )}
      </section>

      {/* Recently Viewed Devices Section (Section 16: capped at 20) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              <span>Recently Viewed Devices</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The latest devices you explored on the portal.
            </p>
          </div>
        </div>

        {recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 8).map((item, idx) => {
              if (!item.device) return null;
              return (
                <Link
                  key={idx}
                  to={`/devices/${item.device.slug}`}
                  className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 block mb-1">
                      {typeof item.device.category === 'object' ? (item.device.category as any)?.name : 'Hardware'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                      {item.device.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.device.shortDescription}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{new Date(item.viewedAt).toLocaleDateString()}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No recently viewed history yet
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Devices you read will automatically appear here for rapid recall.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
