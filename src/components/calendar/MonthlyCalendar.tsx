import { useMemo, useState } from 'react';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isAfter,
  isToday,
  format,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { Habit } from '@/types/habit';
import { toDateString, isHabitScheduledOn } from '@/utils/date';
import { cn } from '@/utils/cn';

interface MonthlyCalendarProps {
  habits: Habit[];
}

interface DayInfo {
  date: Date;
  dateString: string;
  inMonth: boolean;
  scheduledCount: number;
  completedCount: number;
  isFuture: boolean;
}

export function MonthlyCalendar({ habits }: MonthlyCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const today = new Date();

  const days = useMemo<DayInfo[]>(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const result: DayInfo[] = [];
    let day = gridStart;

    while (day <= gridEnd) {
      const dateString = toDateString(day);
      let scheduledCount = 0;
      let completedCount = 0;

      habits.forEach((habit) => {
        if (isHabitScheduledOn(habit, day)) {
          scheduledCount += 1;
          if (habit.completions.includes(dateString)) completedCount += 1;
        }
      });

      result.push({
        date: day,
        dateString,
        inMonth: isSameMonth(day, cursor),
        scheduledCount,
        completedCount,
        isFuture: isAfter(day, today),
      });
      day = addDays(day, 1);
    }

    return result;
  }, [cursor, habits, today]);

  const statusClass = (info: DayInfo): string => {
    if (info.isFuture || info.scheduledCount === 0) {
      return 'bg-transparent';
    }
    if (info.completedCount === info.scheduledCount) {
      return 'bg-moss-500 text-white';
    }
    if (info.completedCount > 0) {
      return 'bg-amber-300/70 text-ink';
    }
    return 'bg-clay-400/25 text-clay-500';
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
          {format(cursor, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-ink/40 dark:text-paper/40">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {days.map((info) => (
          <div
            key={info.dateString}
            title={`${info.completedCount}/${info.scheduledCount} habits completed`}
            className={cn(
              'flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors',
              !info.inMonth && 'opacity-30',
              statusClass(info),
              isToday(info.date) && 'ring-2 ring-moss-600 ring-offset-1 ring-offset-paper dark:ring-offset-charcoal-soft'
            )}
          >
            <span>{format(info.date, 'd')}</span>
            {info.completedCount > 0 && info.completedCount === info.scheduledCount && (
              <Flame className="h-3 w-3" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink/50 dark:text-paper/50">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-moss-500" /> All completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-300/70" /> Partially completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-clay-400/25" /> Missed
        </span>
      </div>
    </div>
  );
}
