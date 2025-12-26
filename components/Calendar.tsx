import React, { useMemo } from 'react';
import { WEEKDAYS } from '../constants';
import { DayType, BankHoliday } from '../types';

interface CalendarProps {
  year: number;
  monthIndex: number; // 0-11
  holidays: BankHoliday[];
  selectedDates: Set<string>;
  streakDates: Set<string>; // Dates part of a consecutive holiday streak
  dragSelection: Set<string>;
  dragMode: 'add' | 'remove';
  isDragging: boolean;
  onDragStart: (date: string) => void;
  onDragEnter: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  year, 
  monthIndex, 
  holidays,
  selectedDates, 
  streakDates, 
  dragSelection,
  dragMode,
  isDragging,
  onDragStart,
  onDragEnter
}) => {
  
  const daysInMonth = useMemo(() => {
    return new Date(year, monthIndex + 1, 0).getDate();
  }, [year, monthIndex]);

  const firstDayOfWeek = useMemo(() => {
    const day = new Date(year, monthIndex, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [year, monthIndex]);

  const days = useMemo(() => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      daysArray.push(dateStr);
    }
    return daysArray;
  }, [year, monthIndex, firstDayOfWeek, daysInMonth]);

  const getDayStatus = (dateStr: string): { type: DayType, name?: string } => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    
    const holiday = holidays.find(h => h.date === dateStr);
    if (holiday) return { type: DayType.BANK_HOLIDAY, name: holiday.name };
    if (dayOfWeek === 0 || dayOfWeek === 6) return { type: DayType.WEEKEND };
    if (selectedDates.has(dateStr)) return { type: DayType.LEAVE };

    return { type: DayType.WORKDAY };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 print-card break-inside-avoid">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateStr, idx) => {
          if (!dateStr) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const { type, name } = getDayStatus(dateStr);
          const isStreak = streakDates.has(dateStr);
          
          let bgClass = "bg-white text-slate-700";
          let isSelected = selectedDates.has(dateStr);
          const isWeekend = type === DayType.WEEKEND;
          const isHoliday = type === DayType.BANK_HOLIDAY;
          const isInteractable = !isWeekend && !isHoliday;

          // Drag Preview Logic
          const isInDrag = isInteractable && dragSelection.has(dateStr);
          let isVisualSelected = isSelected;

          if (isDragging && isInDrag) {
             if (dragMode === 'add') isVisualSelected = true;
             if (dragMode === 'remove') isVisualSelected = false;
          }

          // Visual Styling based on calculated state
          if (isVisualSelected) {
            // Distinguish committed selection vs drag preview
            if (isDragging && isInDrag && dragMode === 'add') {
                bgClass = "bg-teal-300 text-white shadow-sm z-10"; // Preview add
            } else {
                bgClass = "bg-teal-500 text-white font-bold shadow-sm z-10"; // Committed
            }
          } else if (isDragging && isInDrag && dragMode === 'remove') {
             // Preview remove
             bgClass = "bg-slate-100 text-slate-400 line-through decoration-slate-400";
          } else if (isHoliday) {
            bgClass = isStreak 
              ? "bg-rose-100 text-rose-700 font-medium" 
              : "bg-rose-50 text-rose-600 font-medium";
          } else if (isWeekend) {
            bgClass = isStreak
              ? "bg-blue-50 text-slate-500"
              : "bg-slate-50 text-slate-400";
          } else {
            // Workday
             bgClass = "bg-white hover:bg-slate-50 border border-slate-100 text-slate-600";
          }
          
          // Visual tweaks for streak continuity (Blue Line Background)
          // If it's a streak (and not selected leave which is already solid color), add a highlight background
          if (isStreak && !isVisualSelected && !isHoliday && !isWeekend) {
             bgClass = "bg-blue-50 text-blue-700";
          }

          return (
            <div
              key={dateStr}
              onMouseDown={() => isInteractable && onDragStart(dateStr)}
              onMouseEnter={() => isInteractable && onDragEnter(dateStr)}
              className={`
                aspect-square relative rounded-md flex flex-col items-center justify-center transition-all duration-75 overflow-hidden select-none
                ${isInteractable ? 'cursor-pointer' : 'cursor-default'}
                ${bgClass}
                ${isInteractable && !isDragging && !isVisualSelected ? 'hover:border-teal-300' : ''}
                ${isVisualSelected ? 'ring-1 ring-teal-600' : ''}
              `}
              title={name || dateStr}
            >
              {/* Blue Line Indicator for Streak Duration */}
              {isStreak && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500 w-full" />
              )}

              <span className={`text-sm relative z-10 ${isStreak && !isVisualSelected ? 'pt-1' : ''}`}>
                {parseInt(dateStr.split('-')[2])}
              </span>
              
              {isHoliday && (
                 <div className="absolute top-1.5 right-1">
                   <span className="flex h-1.5 w-1.5 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                   </span>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;