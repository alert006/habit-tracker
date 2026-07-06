import { Header } from '@/components/layout/Header';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { CalendarHeatmap } from '@/components/calendar/CalendarHeatmap';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHabits } from '@/contexts/HabitContext';

export function CalendarPage() {
  const { activeHabits } = useHabits();

  if (activeHabits.length === 0) {
    return (
      <>
        <Header title="Calendar" subtitle="A month-by-month view of your consistency." />
        <main className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <EmptyState
            icon="CalendarDays"
            title="Nothing to show yet"
            description="Create a habit to start filling in your calendar."
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Calendar" subtitle="A month-by-month view of your consistency." />
      <main className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
        <section className="mb-6 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <MonthlyCalendar habits={activeHabits} />
        </section>

        <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">
            Last 20 weeks at a glance
          </h2>
          <CalendarHeatmap habits={activeHabits} />
        </section>
      </main>
    </>
  );
}
