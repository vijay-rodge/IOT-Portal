import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { PwaInstallPrompt } from '../pwa/PwaInstallPrompt';
import { PwaUpdatePrompt } from '../pwa/PwaUpdatePrompt';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <OfflineIndicator />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <PwaInstallPrompt />
      <PwaUpdatePrompt />
    </div>
  );
};

