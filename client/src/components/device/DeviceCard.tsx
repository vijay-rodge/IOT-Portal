import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Zap, Radio, Layers } from 'lucide-react';
import { Device, Category } from '../../types';
import { DeviceSymbol } from './DeviceSymbol';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

interface DeviceCardProps {
  device: Device;
  isBookmarked?: boolean;
  onBookmarkToggle?: (deviceId: string, bookmarked: boolean) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const { isAuthenticated, refreshUser } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const categoryName = typeof device.category === 'object' && device.category !== null
    ? (device.category as Category).name
    : 'Hardware';

  const categorySlug = typeof device.category === 'object' && device.category !== null
    ? (device.category as Category).slug
    : '';

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsUpdating(true);
    const newStatus = !bookmarked;
    setBookmarked(newStatus);

    try {
      if (newStatus) {
        await userService.addBookmark(device._id);
      } else {
        await userService.removeBookmark(device._id);
      }
      if (onBookmarkToggle) {
        onBookmarkToggle(device._id, newStatus);
      }
      await refreshUser();
    } catch (err) {
      // Revert state on error
      setBookmarked(!newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <DeviceSymbol symbolCode={device.symbol} size="md" />

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                device.difficultyLevel
              )}`}
            >
              {device.difficultyLevel}
            </span>

            <button
              onClick={handleBookmarkClick}
              disabled={isUpdating}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark device'}
              className={`p-1.5 rounded-lg border transition-all ${
                bookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category tag */}
        {categorySlug && (
          <Link
            to={`/categories/${categorySlug}`}
            className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline mb-1 inline-block"
          >
            {categoryName}
          </Link>
        )}

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 line-clamp-1">
          <Link to={`/devices/${device.slug}`}>{device.name}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {device.shortDescription}
        </p>

        {/* Key Quick Attributes */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{device.voltage || '3.3V - 5V'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Radio className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <span className="truncate">
              {device.communicationProtocols?.[0] || 'Digital/Analog'}
            </span>
          </div>
        </div>

        {/* Protocol Tags Preview */}
        {device.communicationProtocols && device.communicationProtocols.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {device.communicationProtocols.slice(0, 3).map((proto, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {proto}
              </span>
            ))}
            {device.communicationProtocols.length > 3 && (
              <span className="text-[10px] px-1 py-0.5 text-slate-400">
                +{device.communicationProtocols.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View Details Action Link */}
        <Link
          to={`/devices/${device.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-sm group-hover:bg-brand-600 group-hover:text-white dark:group-hover:bg-brand-500"
        >
          <span>View Details & Specs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
