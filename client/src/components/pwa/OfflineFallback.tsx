import React from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OfflineFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  title = 'Content Unavailable Offline',
  message = 'This IoT device or page has not been downloaded to your device cache yet. Please check your internet connection and try again.',
  onRetry,
}) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
          <WifiOff className="w-7 h-7 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Cached Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

