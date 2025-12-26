import React, { useState, useMemo, useEffect } from 'react';
import Calendar from './components/Calendar';
import SummaryPanel from './components/SummaryPanel';
import { MONTH_NAMES, REGION_HOLIDAYS } from './constants';
import { BankHoliday } from './types';

const App: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentYear] = useState(2026);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('england-wales');

  // Drag State
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'add' | 'remove'>('add');

  const currentHolidays: BankHoliday[] = useMemo(() => {
    return REGION_HOLIDAYS[region] || REGION_HOLIDAYS['england-wales'];
  }, [region]);

  const regionDisplayName = useMemo(() => {
    switch(region) {
      case 'scotland': return 'Scotland';
      case 'northern-ireland': return 'Northern Ireland';
      default: return 'England & Wales';
    }
  }, [region]);

  // Auto-Load on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('uk_leave_2026_v1');
      if (saved) {
        setSelectedDates(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error("Failed to load saved dates", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Auto-Save effect
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('uk_leave_2026_auto', JSON.stringify(Array.from(selectedDates)));
    }
  }, [selectedDates, isLoaded]);

  // Global mouse up to end drag
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragStart) {
        finishDrag();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [dragStart, dragCurrent]);

  // Explicit Save
  const handleSave = () => {
    localStorage.setItem('uk_leave_2026_v1', JSON.stringify(Array.from(selectedDates)));
    setSavedMessage("Plan Saved Locally!");
    setTimeout(() => setSavedMessage(null), 2500);
  };

  // Explicit Load
  const handleLoad = () => {
    const saved = localStorage.getItem('uk_leave_2026_v1');
    if (saved) {
      setSelectedDates(new Set(JSON.parse(saved)));
      setSavedMessage("Plan Loaded!");
      setTimeout(() => setSavedMessage(null), 2500);
    } else {
      setSavedMessage("No saved plan found.");
      setTimeout(() => setSavedMessage(null), 2500);
    }
  };

  // Logic: Check if a day is off (Weekend, Holiday, or Selected)
  const isDayOff = (dateStr: string, userSelection: Set<string>): boolean => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const isBankHoliday = currentHolidays.some(h => h.date === dateStr);
    const isSelected = userSelection.has(dateStr);
    return isWeekend || isBankHoliday || isSelected;
  };

  // --- DRAG LOGIC ---

  const getDatesInRange = (startStr: string, endStr: string): string[] => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const dates = [];
    const [lower, upper] = start < end ? [start, end] : [end, start];
    const curr = new Date(lower);
    
    while (curr <= upper) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const handleDragStart = (dateStr: string) => {
    const isAlreadySelected = selectedDates.has(dateStr);
    setDragMode(isAlreadySelected ? 'remove' : 'add');
    setDragStart(dateStr);
    setDragCurrent(dateStr);
  };

  const handleDragEnter = (dateStr: string) => {
    if (dragStart) {
      setDragCurrent(dateStr);
    }
  };

  // Commit the drag selection
  const finishDrag = () => {
    if (!dragStart || !dragCurrent) return;

    const range = getDatesInRange(dragStart, dragCurrent);
    const newSet = new Set(selectedDates);

    range.forEach(date => {
      // Don't modify weekends or bank holidays
      const day = new Date(date).getDay();
      const isWeekend = day === 0 || day === 6;
      const isBankHoliday = currentHolidays.some(h => h.date === date);

      if (!isWeekend && !isBankHoliday) {
        if (dragMode === 'add') {
          newSet.add(date);
        } else {
          newSet.delete(date);
        }
      }
    });

    setSelectedDates(newSet);
    setDragStart(null);
    setDragCurrent(null);
  };

  const dragSelection = useMemo(() => {
    if (!dragStart || !dragCurrent) return new Set<string>();
    const range = getDatesInRange(dragStart, dragCurrent);
    return new Set(range);
  }, [dragStart, dragCurrent]);


  // Logic: Smart Streak Calculation
  const { streakDates, maxConsecutive, streakSummary } = useMemo(() => {
    const sDates = new Set<string>();
    const summaries: { start: string, end: string, length: number }[] = [];
    let maxLen = 0;

    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear + 1, 0, 5); 

    let currentStreak: string[] = [];
    let streakHasLeave = false;

    const effectiveSelection = new Set(selectedDates);
    if (dragStart && dragMode === 'add') {
      dragSelection.forEach(d => effectiveSelection.add(d));
    } else if (dragStart && dragMode === 'remove') {
      dragSelection.forEach(d => effectiveSelection.delete(d));
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const isLeave = effectiveSelection.has(dateStr);
      const isOff = isDayOff(dateStr, effectiveSelection);

      if (isOff) {
        currentStreak.push(dateStr);
        if (isLeave) streakHasLeave = true;
      } else {
        if (currentStreak.length > 0) {
           if (streakHasLeave) {
             currentStreak.forEach(ds => sDates.add(ds));
             if (currentStreak.length > maxLen) maxLen = currentStreak.length;
             
             if (currentStreak.length >= 3) {
               summaries.push({
                 start: currentStreak[0],
                 end: currentStreak[currentStreak.length - 1],
                 length: currentStreak.length
               });
             }
           }
        }
        currentStreak = [];
        streakHasLeave = false;
      }
    }
    
    summaries.sort((a, b) => a.start.localeCompare(b.start));

    return { streakDates: sDates, maxConsecutive: maxLen, streakSummary: summaries };
  }, [selectedDates, currentYear, dragSelection, dragStart, dragMode, region]);


  const handleApplyStrategy = (datesToBook: string[]) => {
    const newSet = new Set(selectedDates);
    datesToBook.forEach(d => newSet.add(d));
    setSelectedDates(newSet);
  };

  const clearAll = () => setSelectedDates(new Set());

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 print:bg-white print:pb-0 select-none print:select-auto">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 print:static print:border-none print:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇬🇧</span>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 print:text-black print:bg-none leading-none">
                UK Leave Maximizer <span className="hidden sm:inline">({regionDisplayName})</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium sm:hidden">{regionDisplayName} Edition</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 no-print">
            {/* Region Selector */}
            <div className="relative">
               <select 
                 value={region}
                 onChange={(e) => setRegion(e.target.value)}
                 className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2 pr-8 cursor-pointer hover:bg-slate-200 transition-colors"
               >
                 <option value="england-wales">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England & Wales</option>
                 <option value="scotland">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland</option>
                 <option value="northern-ireland">☘️ Northern Ireland</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>

            <button 
              onClick={clearAll}
              className="text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        
        {/* Print Only Summary Header */}
        <div className="hidden print:block mb-8 text-center print-header">
           <div className="text-2xl font-bold mb-2">My 2026 Leave Maximizer Plan</div>
           <div className="flex justify-center gap-8 text-sm text-slate-600">
              <p>Region: <strong>{regionDisplayName}</strong></p>
              <p>Leave Days Used: <strong>{selectedDates.size}</strong></p>
              <p>Max Consecutive Streak: <strong>{maxConsecutive}</strong></p>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 print:block">
          
          {/* Left Column: Calendar Grid */}
          <div className="flex-1 print:w-full">
            <p className="no-print text-sm text-slate-400 mb-4 flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-teal-500 rounded text-[10px] text-center text-white leading-4">✓</span>
              Click and drag to select multiple days.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-4 print:gap-4 print-grid-layout">
              {MONTH_NAMES.map((month, index) => (
                <div key={month} className="flex flex-col break-inside-avoid">
                  <h3 className="text-lg font-bold text-slate-700 mb-3 px-1">{month}</h3>
                  <Calendar 
                    year={currentYear} 
                    monthIndex={index} 
                    holidays={currentHolidays}
                    selectedDates={selectedDates}
                    streakDates={streakDates}
                    dragSelection={dragSelection}
                    dragMode={dragMode}
                    isDragging={!!dragStart}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar (Hidden in Print) */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0 no-print">
            <div className="sticky top-24">
              <SummaryPanel 
                selectedCount={selectedDates.size}
                consecutiveDays={maxConsecutive}
                streakSummary={streakSummary}
                selectedDates={selectedDates}
                region={region}
                onApplyStrategy={handleApplyStrategy}
                onSave={handleSave}
                onLoad={handleLoad}
                savedMessage={savedMessage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;