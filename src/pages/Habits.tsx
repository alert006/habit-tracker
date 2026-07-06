import { useMemo, useState } from 'react';
import { Plus, Archive } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/habit/SearchBar';
import { CategoryFilter } from '@/components/habit/CategoryFilter';
import { HabitList } from '@/components/habit/HabitList';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HabitForm } from '@/components/habit/HabitForm';
import { useHabits } from '@/contexts/HabitContext';
import type { Habit } from '@/types/habit';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { HabitCardSkeleton } from '@/components/ui/Loading';
import { cn } from '@/utils/cn';

export function Habits() {
  const { activeHabits, archivedHabits, isLoading, addHabit, updateHabit, deleteHabit, archiveHabit, toggleCompletion } =
    useHabits();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  useKeyboardShortcut('/', (e) => {
    e.preventDefault();
    document.getElementById('habit-search')?.focus();
  });
  useKeyboardShortcut('n', () => setFormOpen(true));

  const sourceHabits = view === 'active' ? activeHabits : archivedHabits;

  const filtered = useMemo(() => {
    return sourceHabits.filter((h) => {
      const matchesSearch =
        search.trim().length === 0 ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || h.categoryId === category;
      return matchesSearch && matchesCategory;
    });
  }, [sourceHabits, search, category]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingHabit(null);
  };

  return (
    <>
      <Header title="Habits" subtitle="Create, organize and track every habit you're building." />
      <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} />
          <Button onClick={() => setFormOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4" /> New habit
          </Button>
        </div>

        <div className="mb-4">
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        <div className="mb-4 flex gap-1 rounded-xl bg-ink/5 dark:bg-paper/10 p-1 w-fit">
          <button
            type="button"
            onClick={() => setView('active')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'active' ? 'bg-white dark:bg-charcoal-soft shadow-soft text-ink dark:text-paper' : 'text-ink/60 dark:text-paper/60'
            )}
          >
            Active ({activeHabits.length})
          </button>
          <button
            type="button"
            onClick={() => setView('archived')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'archived' ? 'bg-white dark:bg-charcoal-soft shadow-soft text-ink dark:text-paper' : 'text-ink/60 dark:text-paper/60'
            )}
          >
            <Archive className="h-3.5 w-3.5" /> Archived ({archivedHabits.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            <HabitCardSkeleton />
            <HabitCardSkeleton />
            <HabitCardSkeleton />
          </div>
        ) : (
          <HabitList
            habits={filtered}
            hasAnyHabits={sourceHabits.length > 0}
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
    </>
  );
}
