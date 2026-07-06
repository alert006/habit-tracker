import type { Habit, HabitStats } from '@/types/habit';
import {
  calculateBestStreak,
  calculateCurrentStreak,
  completionRateOverLastNDays,
} from './date';

export const computeHabitStats = (habit: Habit): HabitStats => ({
  habitId: habit.id,
  currentStreak: calculateCurrentStreak(habit),
  bestStreak: calculateBestStreak(habit),
  totalCompletions: habit.completions.length,
  completionRate30d: completionRateOverLastNDays(habit, 30),
  completionRate7d: completionRateOverLastNDays(habit, 7),
});

export const computeAllStats = (habits: Habit[]): Record<string, HabitStats> => {
  const map: Record<string, HabitStats> = {};
  habits.forEach((h) => {
    map[h.id] = computeHabitStats(h);
  });
  return map;
};

export const totalCompletionsAcross = (habits: Habit[]): number =>
  habits.reduce((sum, h) => sum + h.completions.length, 0);

export const bestStreakAcross = (habits: Habit[]): number =>
  habits.reduce((best, h) => Math.max(best, calculateBestStreak(h)), 0);

export const currentStreakAcross = (habits: Habit[]): number =>
  habits.reduce((best, h) => Math.max(best, calculateCurrentStreak(h)), 0);

export const categoriesUsedAcross = (habits: Habit[]): number =>
  new Set(habits.filter((h) => !h.archived).map((h) => h.categoryId)).size;
