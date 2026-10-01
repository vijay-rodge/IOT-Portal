import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { WifiOff, Wifi, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showRestored, setShowRestored] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (!isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showRestored) {
    return null;
  }

  if (!isOnline && isDismissed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-2.5 px-4 text-xs font-medium transition-all duration-300 flex items-center justify-between shadow-sm z-50 sticky top-0 ${
        isOnline
          ? 'bg-emerald-600 text-white'
          : 'bg-amber-600 text-amber-50 dark:bg-amber-700'
      }`}
    >
      <div className="flex items-center gap-2 mx-auto">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 animate-bounce" />
            <span>Connection restored. You are back online.</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>
              You are offline. Previously loaded IoT information is still available.
            </span>
          </>
        )}
      </div>

      {!isOnline && (
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded hover:bg-amber-700/50 text-amber-200 transition-colors"
          aria-label="Dismiss offline banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

