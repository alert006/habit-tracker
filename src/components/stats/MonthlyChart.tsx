import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, startOfMonth, subMonths, isSameMonth } from 'date-fns';
import type { Habit } from '@/types/habit';
import { parseDateString } from '@/utils/date';

interface MonthlyChartProps {
  habits: Habit[];
  months?: number;
}

export function MonthlyChart({ habits, months = 6 }: MonthlyChartProps) {
  const data = useMemo(() => {
    const now = startOfMonth(new Date());
    const monthStarts = Array.from({ length: months }, (_, i) => subMonths(now, months - 1 - i));

    return monthStarts.map((monthStart) => {
      const count = habits.reduce((sum, habit) => {
        const completionsInMonth = habit.completions.filter((date) =>
          isSameMonth(parseDateString(date), monthStart)
        ).length;
        return sum + completionsInMonth;
      }, 0);
      return { month: format(monthStart, 'MMM'), completions: count };
    });
  }, [habits, months]);

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
          dataKey="month"
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-ink/50 dark:text-paper/50"
          axisLine={false}
          tickLine={false}
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
        <Bar dataKey="completions" fill="#E8A33D" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
