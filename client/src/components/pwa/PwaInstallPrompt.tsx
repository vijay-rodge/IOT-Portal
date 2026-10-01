import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const STORAGE_DISMISS_KEY = 'iot_pwa_install_dismissed';
const DISMISS_COOLDOWN_DAYS = 7;

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if app is already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // 2. Check dismissal preference in localStorage
    const dismissedTimestamp = localStorage.getItem(STORAGE_DISMISS_KEY);
    if (dismissedTimestamp) {
      const daysSinceDismiss =
        (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) {
        return;
      }
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. iOS Safari detection (iOS doesn't fire beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      userAgent.includes('safari') &&
      !userAgent.includes('crios') &&
      !userAgent.includes('fxios') &&
      !userAgent.includes('chrome');

    if (isIosDevice && isSafari && !isStandalone) {
      setIsIOS(true);
      // Give the user a moment to browse before showing the subtle iOS prompt
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }

    // Listen for appinstalled event to hide prompt
    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSGuide(true);
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      } else {
        handleDismiss();
      }
    } catch (err) {
      console.error('Error during PWA installation:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSGuide(false);
    localStorage.setItem(STORAGE_DISMISS_KEY, Date.now().toString());
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-[calc(100%-2rem)] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Smartphone className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Install IoT Knowledge Portal
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Fast, standalone offline access to all IoT pinouts, sensors, and technical specs.
            </p>

            {showIOSGuide && (
              <div className="mt-2.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Tap the <strong className="text-brand-600">Share</strong> icon in Safari, then tap{' '}
                <strong className="text-brand-600">'Add to Home Screen'</strong>.
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isIOS ? 'How to Install' : 'Install App'}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

