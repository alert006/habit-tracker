import {
  format,
  parseISO,
  isValid,
  subDays,
  addDays,
  startOfDay,
  differenceInCalendarDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';
import type { DateString, Habit } from '@/types/habit';

export const DATE_FORMAT = 'yyyy-MM-dd';

export const todayString = (): DateString => format(startOfDay(new Date()), DATE_FORMAT);

export const toDateString = (date: Date): DateString => format(date, DATE_FORMAT);

export const parseDateString = (value: DateString): Date => {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date();
};

export const isHabitScheduledOn = (habit: Habit, date: Date): boolean => {
  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'custom') return habit.customDays.includes(date.getDay());
  // 'weekly' habits are shown every day; completion is tracked against a weekly target.
  return true;
};

export const isCompletedOn = (habit: Habit, date: DateString): boolean =>
  habit.completions.includes(date);

/**
 * Current streak counting back from today. A day only breaks the streak if the
 * habit was scheduled on that day and not completed. For 'weekly' habits, streak
 * counts consecutive completions on any scheduled/completed day.
 */
export const calculateCurrentStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0;
  const completed = new Set(habit.completions);
  let streak = 0;
  let cursor = startOfDay(new Date());

  // If today isn't completed yet, start counting from yesterday so an
  // in-progress day doesn't prematurely zero the streak.
  if (!completed.has(toDateString(cursor))) {
    cursor = subDays(cursor, 1);
  }

  for (let i = 0; i < 3650; i += 1) {
    const key = toDateString(cursor);
    const scheduled = isHabitScheduledOn(habit, cursor);
    if (completed.has(key)) {
      streak += 1;
      cursor = subDays(cursor, 1);
      continue;
    }
    if (scheduled) break;
    cursor = subDays(cursor, 1);
  }

  return streak;
};

export const calculateBestStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = parseDateString(sorted[i - 1]);
    const curr = parseDateString(sorted[i]);
    const gap = differenceInCalendarDays(curr, prev);
    if (gap === 1) {
      current += 1;
    } else if (gap === 0) {
      // duplicate safeguard, ignore
      continue;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
  }

  return best;
};

export const completionRateOverLastNDays = (habit: Habit, days: number): number => {
  const end = startOfDay(new Date());
  const start = subDays(end, days - 1);
  let scheduledCount = 0;
  let completedCount = 0;

  for (let i = 0; i < days; i += 1) {
    const day = addDays(start, i);
    if (day > end) break;
    if (!isHabitScheduledOn(habit, day)) continue;
    scheduledCount += 1;
    if (isCompletedOn(habit, toDateString(day))) completedCount += 1;
  }

  if (scheduledCount === 0) return 0;
  return Math.round((completedCount / scheduledCount) * 100);
};

export const completionsThisWeek = (habit: Habit): number => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return habit.completions.filter((c) => isWithinInterval(parseDateString(c), { start, end })).length;
};

/** Generates the last N days (inclusive of today) as Date objects, oldest first. */
export const lastNDays = (n: number): Date[] => {
  const today = startOfDay(new Date());
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
};

export const formatFriendlyDate = (date: DateString): string => format(parseDateString(date), 'EEE, MMM d');

export const formatMonthLabel = (date: Date): string => format(date, 'MMM');

export const formatWeekdayShort = (date: Date): string => format(date, 'EEEEE');
