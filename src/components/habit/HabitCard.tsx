import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical, Pencil, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { getCategory } from '@/data/categories';
import type { Habit } from '@/types/habit';
import { computeHabitStats } from '@/utils/stats';
import { todayString, completionsThisWeek } from '@/utils/date';
import { cn } from '@/utils/cn';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export function HabitCard({ habit, onToggleToday, onEdit, onDelete, onArchive }: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const category = getCategory(habit.categoryId);
  const stats = computeHabitStats(habit);
  const isDoneToday = habit.completions.includes(todayString());
  const weeklyTarget = habit.frequency === 'weekly' ? habit.timesPerWeek : 7;
  const weeklyDone = habit.frequency === 'weekly' ? completionsThisWeek(habit) : undefined;

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center gap-4 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${category.color}1A`, color: category.color }}
      >
        <DynamicIcon name={habit.icon} className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-ink dark:text-paper">{habit.name}</h3>
          {stats.currentStreak > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
              <Flame className="h-3.5 w-3.5" />
              {stats.currentStreak}
            </span>
          )}
        </div>
        <p className="truncate text-sm text-ink/50 dark:text-paper/50">
          {category.name}
          {habit.frequency === 'weekly' && weeklyDone !== undefined && (
            <span> · {weeklyDone}/{weeklyTarget} this week</span>
          )}
          {habit.frequency === 'custom' && <span> · custom days</span>}
        </p>
      </div>

      {habit.frequency === 'weekly' && weeklyDone !== undefined ? (
        <ProgressRing
          progress={(weeklyDone / weeklyTarget) * 100}
          size={44}
          strokeWidth={4}
          color={category.color}
        />
      ) : (
        <button
          type="button"
          onClick={onToggleToday}
          aria-pressed={isDoneToday}
          aria-label={isDoneToday ? `Mark ${habit.name} as not done today` : `Mark ${habit.name} as done today`}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            isDoneToday
              ? 'border-moss-600 bg-moss-600 text-white'
              : 'border-ink/15 dark:border-paper/20 text-transparent hover:border-moss-400'
          )}
        >
          <Check className="h-5 w-5" />
        </button>
      )}

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={`More actions for ${habit.name}`}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/40 hover:bg-ink/5 dark:text-paper/40 dark:hover:bg-paper/10"
        >
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-softer shadow-card"
          >
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onArchive();
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10"
            >
              {habit.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
              {habit.archived ? 'Restore' : 'Archive'}
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-clay-500 hover:bg-clay-500/10"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
