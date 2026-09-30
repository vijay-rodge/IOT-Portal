import React from 'react';
import { ConnectionDiagram } from '../../types';
import { GitBranch, CheckCircle2 } from 'lucide-react';

interface ConnectionDiagramViewProps {
  diagram: ConnectionDiagram;
}

export const ConnectionDiagramView: React.FC<ConnectionDiagramViewProps> = ({ diagram }) => {
  return (
    <div className="space-y-6">
      {/* Narrative Description */}
      {diagram.description && (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-brand-50/50 dark:bg-brand-950/30 p-4 rounded-xl border border-brand-100 dark:border-brand-900/60">
          {diagram.description}
        </p>
      )}

      {/* Wiring Steps List */}
      {diagram.wiringSteps && diagram.wiringSteps.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-500" />
            <span>Recommended Breadboard / Terminal Wiring Steps</span>
          </h4>
          <ul className="space-y-2.5">
            {diagram.wiringSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="font-mono">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
