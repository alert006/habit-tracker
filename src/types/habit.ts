export type Frequency = 'daily' | 'weekly' | 'custom';

/** ISO date string in yyyy-MM-dd form (no time component). */
export type DateString = string;

export interface Habit {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  color: string;
  icon: string;
  frequency: Frequency;
  /** For 'custom' frequency: 0 (Sun) - 6 (Sat) of active days. Ignored for 'daily'. */
  customDays: number[];
  /** For 'weekly' frequency: how many times per week the habit should be done. */
  timesPerWeek: number;
  createdAt: string;
  archived: boolean;
  /** Sorted ascending array of completed dates, yyyy-MM-dd, unique. */
  completions: DateString[];
}

export type HabitDraft = Pick<
  Habit,
  'name' | 'description' | 'categoryId' | 'color' | 'icon' | 'frequency' | 'customDays' | 'timesPerWeek'
>;

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate30d: number;
  completionRate7d: number;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export type ExportPayload = {
  version: 1;
  exportedAt: string;
  habits: Habit[];
  unlockedAchievements: UnlockedAchievement[];
};
