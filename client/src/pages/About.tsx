import React from 'react';
import { Cpu, ShieldCheck, BookOpen, Layers, Terminal, Server, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About IoT Knowledge Portal
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          An open, production-grade educational and technical reference platform engineered to bridge the gap between abstract electronics theory and real-world IoT deployment.
        </p>
      </div>

      {/* Core Mission */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The Internet of Things ecosystem is often fragmented across conflicting vendor documentation, inaccurate forum pins, and marketing datasheets that obscure crucial operational nuances. Our portal provides a structured, verified single-source-of-truth for microcontrollers, sensors, actuators, and communication transceivers.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Full-Stack Technical Architecture</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Modern React Frontend
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Vite, React 18, TypeScript, Tailwind CSS, Lucide icons, responsive navigation, and instant light/dark mode toggling. In-memory token management with silent Axios interceptor refresh.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Node.js & Express REST Backend
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict TypeScript REST API with JWT access tokens, HTTP-only secure refresh cookie rotation, bcrypt password hashing, Google OAuth server-side verification, Helmet, and rate limiting.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> MongoDB & Mongoose Schema
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Robust schemas with compound text indexes for instant search across names, tags, and protocols. Database-driven categories, dynamic specifications, pinouts, and TTL refresh token collections.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Role-Based Access Control
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-tier permissions distinguishing standard learners from platform administrators. Full administrative CRUD dashboards for devices, categories, and user management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
