import React from 'react';
import { PinConfiguration } from '../../types';

interface PinoutTableProps {
  pins: PinConfiguration[];
}

export const PinoutTable: React.FC<PinoutTableProps> = ({ pins }) => {
  if (!pins || pins.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 border border-dashed rounded-xl">
        No pinout details specified for this module.
      </div>
    );
  }

  const getTypeBadgeClass = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('power') || lower.includes('vcc') || lower.includes('+')) {
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    }
    if (lower.includes('ground') || lower.includes('gnd')) {
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
    if (lower.includes('analog') || lower.includes('adc')) {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
    if (lower.includes('pwm')) {
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }
    if (lower.includes('i2c') || lower.includes('spi') || lower.includes('uart') || lower.includes('serial')) {
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
    }
    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3 px-4 w-16">Pin #</th>
            <th className="py-3 px-4 w-32">Pin Identifier</th>
            <th className="py-3 px-4 w-36">Signal Function</th>
            <th className="py-3 px-4">Pin Description & Interfacing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
          {pins.map((pin, idx) => (
            <tr
              key={idx}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                {pin.pinNumber}
              </td>
              <td className="py-3 px-4 font-mono font-semibold text-brand-600 dark:text-brand-400">
                {pin.pinName}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadgeClass(
                    pin.type
                  )}`}
                >
                  {pin.type}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                {pin.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
