import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Habit } from '@/types/habit';
import { lastNDays, toDateString } from '@/utils/date';
import { format } from 'date-fns';

interface WeeklyChartProps {
  habits: Habit[];
  days?: number;
}

export function WeeklyChart({ habits, days = 14 }: WeeklyChartProps) {
  const data = useMemo(() => {
    const dates = lastNDays(days);
    return dates.map((date) => {
      const dateString = toDateString(date);
      const count = habits.reduce(
        (sum, h) => sum + (h.completions.includes(dateString) ? 1 : 0),
        0
      );
      return { date: format(date, 'MMM d'), completions: count };
    });
  }, [habits, days]);

  const hasData = data.some((d) => d.completions > 0);

  if (!hasData) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-ink/40 dark:text-paper/40">
        No completions logged in this period yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ink/10 dark:text-paper/10" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-ink/50 dark:text-paper/50"
          axisLine={false}
          tickLine={false}
          interval={Math.max(0, Math.floor(data.length / 7) - 1)}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-ink/50 dark:text-paper/50"
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          cursor={{ fill: 'rgba(61,139,92,0.08)' }}
          contentStyle={{
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 8px 20px -4px rgb(28 27 24 / 0.15)',
            fontSize: 13,
          }}
        />
        <Bar dataKey="completions" fill="#3D8B5C" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
