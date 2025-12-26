import React, { useMemo } from 'react';
import { REGION_STRATEGIES } from '../constants';
import { LeaveStrategy } from '../types';

interface SummaryPanelProps {
  selectedCount: number;
  consecutiveDays: number;
  streakSummary: { start: string, end: string, length: number }[];
  selectedDates: Set<string>;
  region: string;
  onApplyStrategy: (dates: string[]) => void;
  onSave: () => void;
  onLoad: () => void;
  savedMessage: string | null;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  selectedCount, 
  consecutiveDays, 
  streakSummary,
  selectedDates,
  region,
  onApplyStrategy,
  onSave,
  onLoad,
  savedMessage
}) => {
  
  const strategies = useMemo(() => {
    return REGION_STRATEGIES[region] || REGION_STRATEGIES['england-wales'];
  }, [region]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 no-print">
      
      {/* Controls */}
      <div className="flex gap-2">
         <button 
           type="button"
           onClick={onSave}
           className="flex-1 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
         >
           Save Locally
         </button>
         <button 
           type="button"
           onClick={onLoad}
           className="flex-1 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
         >
           Load Locally
         </button>
      </div>
      {savedMessage && (
        <div className="p-2 bg-green-50 text-green-700 text-sm text-center rounded-lg animate-pulse">
          {savedMessage}
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📊</span> Summary
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Leave Used</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{selectedCount}</p>
            <p className="text-xs text-blue-500 mt-1">days</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 text-center">
            <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Max Streak</p>
            <p className="text-3xl font-bold text-teal-700 mt-1">{consecutiveDays}</p>
            <p className="text-xs text-teal-500 mt-1">days off</p>
          </div>
        </div>

        {/* Live Streak List */}
        {streakSummary.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Long Breaks</p>
            <ul className="space-y-2">
              {streakSummary.map((streak, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">
                    {formatDate(streak.start)} <span className="text-slate-400">→</span> {formatDate(streak.end)}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {streak.length} Days
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Strategies */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🚀</span> Auto-Fill Common Hacks
        </h2>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
          {strategies.map((strat: LeaveStrategy) => (
            <button
              type="button"
              key={strat.id}
              onClick={() => onApplyStrategy(strat.datesToBook)}
              className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-teal-200 hover:bg-teal-50 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-teal-800">{strat.name}</span>
                  <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    {strat.totalDaysOff} Days Off
                  </span>
                </div>
                <p className="text-sm text-slate-500 group-hover:text-teal-600 font-medium">{strat.description}</p>
                <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-1">
                  {strat.bankHolidaysinvolved.map(bh => (
                    <span key={bh} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-white/50">{bh}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 text-center border-t border-slate-100 pt-2">
           <p className="text-xs text-slate-400 italic">Strategies tailored for {region.replace('-', ' & ')}.</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;