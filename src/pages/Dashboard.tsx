import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { HabitList } from '@/components/habit/HabitList';
import { CalendarHeatmap } from '@/components/calendar/CalendarHeatmap';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { MotivationCard } from '@/components/dashboard/MotivationCard';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HabitForm } from '@/components/habit/HabitForm';
import { Confetti } from '@/components/ui/Confetti';
import { useHabits } from '@/contexts/HabitContext';
import type { Habit } from '@/types/habit';
import { bestStreakAcross, currentStreakAcross, totalCompletionsAcross } from '@/utils/stats';
import { isHabitScheduledOn, todayString } from '@/utils/date';
import { HabitCardSkeleton } from '@/components/ui/Loading';

export function Dashboard() {
  const { activeHabits, isLoading, addHabit, updateHabit, deleteHabit, archiveHabit, toggleCompletion } =
    useHabits();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const wasAllCompleteRef = useRef(false);

  const todaysHabits = useMemo(
    () => activeHabits.filter((h) => isHabitScheduledOn(h, new Date())),
    [activeHabits]
  );

  const today = todayString();
  const completedToday = todaysHabits.filter((h) => h.completions.includes(today)).length;
  const todayCompletionRate =
    todaysHabits.length === 0 ? 0 : Math.round((completedToday / todaysHabits.length) * 100);
  const allCompleteToday = todaysHabits.length > 0 && completedToday === todaysHabits.length;

  // Celebrate with confetti the moment every habit scheduled for today gets checked off.
  useEffect(() => {
    if (allCompleteToday && !wasAllCompleteRef.current) {
      setShowConfetti(true);
      toast.success('All habits complete for today! 🎉');
    }
    wasAllCompleteRef.current = allCompleteToday;
  }, [allCompleteToday]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditingHabit(null);
  };

  return (
    <>
      <Header title={`${greeting} 🌱`} subtitle="Here's what's on your plate today." />
      <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <div className="mb-6">
          <StatsOverview
            activeHabitCount={activeHabits.length}
            currentStreak={currentStreakAcross(activeHabits)}
            longestStreak={bestStreakAcross(activeHabits)}
            totalCompletions={totalCompletionsAcross(activeHabits)}
            completionRate={todayCompletionRate}
          />
        </div>

        <div className="mb-6">
          <MotivationCard />
        </div>

        <section className="mb-6 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink/70 dark:text-paper/70">Last 20 weeks</h2>
          <CalendarHeatmap habits={activeHabits} />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-paper">Today</h2>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" /> New habit
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <HabitCardSkeleton />
              <HabitCardSkeleton />
              <HabitCardSkeleton />
            </div>
          ) : (
            <HabitList
              habits={todaysHabits}
              hasAnyHabits={activeHabits.length > 0}
              onToggleToday={toggleCompletion}
              onEdit={(habit) => {
                setEditingHabit(habit);
                setFormOpen(true);
              }}
              onDelete={setDeletingHabit}
              onArchive={(habit) => archiveHabit(habit.id, !habit.archived)}
              onCreateNew={() => setFormOpen(true)}
            />
          )}
        </section>
      </main>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={editingHabit ? 'Edit habit' : 'New habit'}>
        <HabitForm
          initialHabit={editingHabit ?? undefined}
          onCancel={closeForm}
          onSubmit={(draft) => {
            if (editingHabit) {
              updateHabit(editingHabit.id, draft);
            } else {
              addHabit(draft);
            }
            closeForm();
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingHabit)}
        title="Delete habit?"
        description={`"${deletingHabit?.name}" and all of its history will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingHabit) deleteHabit(deletingHabit.id);
          setDeletingHabit(null);
        }}
        onCancel={() => setDeletingHabit(null)}
      />

      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
    </>
  );
}
