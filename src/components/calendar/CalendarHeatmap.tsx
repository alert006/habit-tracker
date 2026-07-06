import { useMemo, useState } from 'react';
import { subWeeks, startOfWeek, addDays, isSameMonth, isAfter, startOfDay } from 'date-fns';
import type { Habit } from '@/types/habit';
import { toDateString, formatFriendlyDate, formatMonthLabel } from '@/utils/date';
import { cn } from '@/utils/cn';

interface CalendarHeatmapProps {
  habits: Habit[];
  weeks?: number;
}

interface DayCell {
  date: Date;
  dateString: string;
  count: number;
  isFuture: boolean;
}

const intensityClass = (count: number, max: number): string => {
  if (count === 0) return 'bg-ink/[0.06] dark:bg-paper/[0.06]';
  const ratio = max === 0 ? 0 : count / max;
  if (ratio > 0.75) return 'bg-moss-700';
  if (ratio > 0.5) return 'bg-moss-600';
  if (ratio > 0.25) return 'bg-moss-400';
  return 'bg-moss-200';
};

export function CalendarHeatmap({ habits, weeks = 20 }: CalendarHeatmapProps) {
  const [hovered, setHovered] = useState<DayCell | null>(null);
  const today = startOfDay(new Date());

  const { columns, monthLabels, maxCount } = useMemo(() => {
    const gridStart = startOfWeek(subWeeks(today, weeks - 1), { weekStartsOn: 1 });
    const completionsByDate = new Map<string, number>();

    habits.forEach((habit) => {
      habit.completions.forEach((date) => {
        completionsByDate.set(date, (completionsByDate.get(date) ?? 0) + 1);
      });
    });

    const cols: DayCell[][] = [];
    let max = 0;

    for (let w = 0; w < weeks; w += 1) {
      const col: DayCell[] = [];
      for (let d = 0; d < 7; d += 1) {
        const date = addDays(gridStart, w * 7 + d);
        const dateString = toDateString(date);
        const count = completionsByDate.get(dateString) ?? 0;
        max = Math.max(max, count);
        col.push({ date, dateString, count, isFuture: isAfter(date, today) });
      }
      cols.push(col);
    }

    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;
    cols.forEach((col, index) => {
      const month = col[0].date.getMonth();
      if (month !== lastMonth && !isSameMonth(col[0].date, cols[Math.max(0, index - 1)][0].date)) {
        labels.push({ index, label: formatMonthLabel(col[0].date) });
        lastMonth = month;
      }
    });

    return { columns: cols, monthLabels: labels, maxCount: max };
  }, [habits, weeks, today]);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="relative mb-1 h-4" style={{ minWidth: columns.length * 15 }}>
        {monthLabels.map(({ index, label }) => (
          <span
            key={`${label}-${index}`}
            className="absolute text-[11px] text-ink/40 dark:text-paper/40"
            style={{ left: index * 15 }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px]" style={{ minWidth: columns.length * 15 }}>
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-[3px]">
            {col.map((cell) => (
              <button
                key={cell.dateString}
                type="button"
                disabled={cell.isFuture}
                onMouseEnter={() => setHovered(cell)}
                onFocus={() => setHovered(cell)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${cell.count} completion${cell.count === 1 ? '' : 's'} on ${formatFriendlyDate(cell.dateString)}`}
                className={cn(
                  'h-[12px] w-[12px] rounded-[3px] transition-transform focus-visible:scale-125',
                  cell.isFuture ? 'bg-transparent' : intensityClass(cell.count, maxCount),
                  !cell.isFuture && 'hover:scale-125'
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink/40 dark:text-paper/40">
        <span aria-live="polite" className="min-h-[1rem]">
          {hovered
            ? `${hovered.count} completion${hovered.count === 1 ? '' : 's'} · ${formatFriendlyDate(hovered.dateString)}`
            : 'Hover or focus a day for details'}
        </span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <span className="h-[10px] w-[10px] rounded-[2px] bg-ink/[0.06] dark:bg-paper/[0.06]" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-moss-200" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-moss-400" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-moss-600" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-moss-700" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
