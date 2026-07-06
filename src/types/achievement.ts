import type { Habit } from './habit';

export interface AchievementContext {
  habits: Habit[];
  totalCompletions: number;
  bestStreakOverall: number;
  activeHabitCount: number;
  categoriesUsed: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isUnlocked: (ctx: AchievementContext) => boolean;
}

export interface AchievementProgress extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt?: string;
}
