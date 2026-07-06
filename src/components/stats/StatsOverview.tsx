import type { ReactNode } from 'react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface StatCardProps {
  icon: string;
  label: string;
  value: ReactNode;
  accent?: string;
}

function StatCard({ icon, label, value, accent = '#3D8B5C' }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <DynamicIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink/50 dark:text-paper/50">{label}</p>
        <p className="truncate text-lg font-semibold text-ink dark:text-paper">{value}</p>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  activeHabitCount: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export function StatsOverview({
  activeHabitCount,
  currentStreak,
  longestStreak,
  totalCompletions,
  completionRate,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatCard icon="ListChecks" label="Total habits" value={activeHabitCount} accent="#3D8B5C" />
      <StatCard icon="Flame" label="Current streak" value={`${currentStreak}d`} accent="#E8A33D" />
      <StatCard icon="Trophy" label="Longest streak" value={`${longestStreak}d`} accent="#C25F3F" />
      <StatCard icon="CheckCircle2" label="Completion %" value={`${completionRate}%`} accent="#3E8FB0" />
      <StatCard icon="Sparkles" label="Total completions" value={totalCompletions} accent="#8A7CC7" />
    </div>
  );
}
