import { AnimatePresence } from 'framer-motion';
import type { Habit } from '@/types/habit';
import { HabitCard } from './HabitCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  hasAnyHabits: boolean;
  onToggleToday: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
  onCreateNew: () => void;
}

export function HabitList({
  habits,
  hasAnyHabits,
  onToggleToday,
  onEdit,
  onDelete,
  onArchive,
  onCreateNew,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon={hasAnyHabits ? 'SearchX' : 'Sprout'}
        title={hasAnyHabits ? 'No habits match your filters' : 'No habits yet'}
        description={
          hasAnyHabits
            ? 'Try a different search term or clear your category filter.'
            : 'Create your first habit to start building momentum today.'
        }
        action={
          !hasAnyHabits && (
            <Button onClick={onCreateNew} className="mt-1">
              <Plus className="h-4 w-4" /> New habit
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggleToday={() => onToggleToday(habit.id)}
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit)}
            onArchive={() => onArchive(habit)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
