import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Habit } from '@/types/habit';
import { getCategory } from '@/data/categories';
import { EmptyState } from '@/components/ui/EmptyState';

interface CategoryBreakdownProps {
  habits: Habit[];
}

export function CategoryBreakdown({ habits }: CategoryBreakdownProps) {
  const data = useMemo(() => {
    const totals = new Map<string, number>();
    habits.forEach((habit) => {
      totals.set(habit.categoryId, (totals.get(habit.categoryId) ?? 0) + habit.completions.length);
    });
    return Array.from(totals.entries())
      .map(([categoryId, value]) => ({
        categoryId,
        name: getCategory(categoryId).name,
        value,
        color: getCategory(categoryId).color,
      }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [habits]);

  if (data.length === 0) {
    return <EmptyState icon="PieChart" title="No data yet" description="Complete a habit to see your category breakdown." />;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={220} className="sm:max-w-[220px]">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 8px 20px -4px rgb(28 27 24 / 0.15)',
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex flex-1 flex-col gap-2">
        {data.map((entry) => (
          <li key={entry.categoryId} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink/70 dark:text-paper/70">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-ink dark:text-paper">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
