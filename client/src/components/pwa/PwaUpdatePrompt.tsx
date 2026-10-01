import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const PwaUpdatePrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.warn('[PWA] Service Worker registration failed:', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 max-w-sm w-[calc(100%-2rem)] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white">Update Available</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            A new version of the IoT Knowledge Portal is ready.
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={close}
              className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={close}
          className="text-slate-400 hover:text-white p-0.5"
          aria-label="Close update prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

