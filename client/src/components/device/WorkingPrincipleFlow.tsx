import React from 'react';
import { ArrowDown, CheckCircle2, ChevronRight } from 'lucide-react';

interface WorkingPrincipleFlowProps {
  steps?: string[];
  principleText: string;
}

export const WorkingPrincipleFlow: React.FC<WorkingPrincipleFlowProps> = ({
  steps = [],
  principleText,
}) => {
  return (
    <div className="space-y-6">
      {/* Narrative explanation */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <p>{principleText}</p>
      </div>

      {/* Visual Step Sequence */}
      {steps && steps.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <span>Visual Signal & Physical Processing Flow</span>
          </h4>

          <div className="relative">
            {/* Step list with vertical line connect */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3.5 group">
                  {/* Number indicator */}
                  <div className="relative flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 ring-4 ring-brand-100 dark:ring-brand-950/80">
                    {index + 1}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 group-hover:border-brand-500/40 transition-colors">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
