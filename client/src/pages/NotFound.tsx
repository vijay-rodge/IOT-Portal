import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-500 mx-auto flex items-center justify-center">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Hardware Page Not Found
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested IoT device reference, category, or portal URL does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
