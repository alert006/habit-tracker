import { Flame } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { WeeklyChart } from '@/components/stats/WeeklyChart';
import { MonthlyChart } from '@/components/stats/MonthlyChart';
import { CategoryBreakdown } from '@/components/stats/CategoryBreakdown';
import { CalendarHeatmap } from '@/components/calendar/CalendarHeatmap';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHabits } from '@/contexts/HabitContext';
import { bestStreakAcross, computeHabitStats, currentStreakAcross, totalCompletionsAcross } from '@/utils/stats';
import { todayString, isHabitScheduledOn } from '@/utils/date';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { getCategory } from '@/data/categories';

export function Statistics() {
  const { activeHabits } = useHabits();
  const today = todayString();

  const scheduledToday = activeHabits.filter((h) => isHabitScheduledOn(h, new Date()));
  const completedToday = scheduledToday.filter((h) => h.completions.includes(today)).length;
  const todayRate = scheduledToday.length === 0 ? 0 : Math.round((completedToday / scheduledToday.length) * 100);

  const leaderboard = [...activeHabits]
    .map((h) => ({ habit: h, stats: computeHabitStats(h) }))
    .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
    .slice(0, 5);

  if (activeHabits.length === 0) {
    return (
      <>
        <Header title="Statistics" subtitle="Trends across all of your habits." />
        <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
          <EmptyState
            icon="BarChart3"
            title="No data to show yet"
            description="Create a habit and start checking it off to see your statistics here."
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Statistics" subtitle="Trends across all of your habits." />
      <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <div className="mb-6">
          <StatsOverview
            activeHabitCount={activeHabits.length}
            currentStreak={currentStreakAcross(activeHabits)}
            longestStreak={bestStreakAcross(activeHabits)}
            totalCompletions={totalCompletionsAcross(activeHabits)}
            completionRate={todayRate}
          />
        </div>

        <section className="mb-6 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">Consistency</h2>
          <CalendarHeatmap habits={activeHabits} />
        </section>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">Last 14 days</h2>
            <WeeklyChart habits={activeHabits} />
          </section>
          <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">Last 6 months</h2>
            <MonthlyChart habits={activeHabits} />
          </section>
          <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5 lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">By category</h2>
            <CategoryBreakdown habits={activeHabits} />
          </section>
        </div>

        <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">Streak leaderboard</h2>
          <ul className="flex flex-col gap-2">
            {leaderboard.map(({ habit, stats }, index) => {
              const category = getCategory(habit.categoryId);
              return (
                <li
                  key={habit.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink/5 dark:hover:bg-paper/5"
                >
                  <span className="w-5 text-center text-sm font-semibold text-ink/40 dark:text-paper/40">
                    {index + 1}
                  </span>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                  >
                    <DynamicIcon name={habit.icon} className="h-4 w-4" />
                  </div>
                  <span className="flex-1 truncate text-sm font-medium text-ink dark:text-paper">
                    {habit.name}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                    <Flame className="h-4 w-4" />
                    {stats.currentStreak}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
