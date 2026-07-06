import type { Habit, UnlockedAchievement } from '@/types/habit';

const HABITS_KEY = 'sprout:habits:v1';
const ACHIEVEMENTS_KEY = 'sprout:achievements:v1';
const THEME_KEY = 'sprout:theme:v1';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeRead<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): boolean {
  if (!isBrowser) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Storage might be full or disabled (private browsing); fail silently
    // and let the caller decide whether to surface a toast.
    return false;
  }
}

export const storage = {
  loadHabits(): Habit[] {
    return safeRead<Habit[]>(HABITS_KEY, []);
  },
  saveHabits(habits: Habit[]): boolean {
    return safeWrite(HABITS_KEY, habits);
  },
  loadUnlockedAchievements(): UnlockedAchievement[] {
    return safeRead<UnlockedAchievement[]>(ACHIEVEMENTS_KEY, []);
  },
  saveUnlockedAchievements(unlocked: UnlockedAchievement[]): boolean {
    return safeWrite(ACHIEVEMENTS_KEY, unlocked);
  },
  loadTheme(): 'light' | 'dark' | null {
    return safeRead<'light' | 'dark' | null>(THEME_KEY, null);
  },
  saveTheme(theme: 'light' | 'dark'): boolean {
    return safeWrite(THEME_KEY, theme);
  },
};
