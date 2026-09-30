import React from 'react';
import { Specification } from '../../types';
import { Info } from 'lucide-react';

interface SpecificationTableProps {
  specifications: Specification[];
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 border border-dashed rounded-xl">
        No technical specifications listed.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3 px-4 w-1/3">Parameter</th>
            <th className="py-3 px-4 w-1/3">Operating Value / Rating</th>
            <th className="py-3 px-4 w-1/3">Technical Notes & Variations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
          {specifications.map((spec, idx) => (
            <tr
              key={idx}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                {spec.key}
              </td>
              <td className="py-3 px-4 font-mono font-medium text-brand-600 dark:text-brand-400">
                {spec.value}
              </td>
              <td className="py-3 px-4 text-slate-500 dark:text-slate-400 italic">
                {spec.notes ? (
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{spec.notes}</span>
                  </span>
                ) : (
                  'Standard nominal operating parameter'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
