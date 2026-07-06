import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import type { AchievementProgress } from '@/types/achievement';
import type { ExportPayload, Habit, HabitDraft, UnlockedAchievement } from '@/types/habit';
import { storage } from '@/services/storage';
import { generateId } from '@/utils/id';
import { todayString } from '@/utils/date';
import { ACHIEVEMENTS } from '@/data/achievements';
import { bestStreakAcross, categoriesUsedAcross, totalCompletionsAcross } from '@/utils/stats';

interface HabitContextValue {
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  isLoading: boolean;
  addHabit: (draft: HabitDraft) => Habit;
  updateHabit: (id: string, draft: HabitDraft) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string, archived: boolean) => void;
  toggleCompletion: (id: string, date?: string) => void;
  achievements: AchievementProgress[];
  newlyUnlocked: AchievementProgress[];
  clearNewlyUnlocked: () => void;
  replaceAllData: (payload: ExportPayload) => void;
  unlockedAchievements: UnlockedAchievement[];
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementProgress[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    setHabits(storage.loadHabits());
    setUnlockedAchievements(storage.loadUnlockedAchievements());
    setIsLoading(false);
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    storage.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    storage.saveUnlockedAchievements(unlockedAchievements);
  }, [unlockedAchievements]);

  // Recompute achievement unlock state whenever habits change.
  useEffect(() => {
    if (!hasHydrated.current) return;
    const ctx = {
      habits,
      totalCompletions: totalCompletionsAcross(habits),
      bestStreakOverall: bestStreakAcross(habits),
      activeHabitCount: habits.filter((h) => !h.archived).length,
      categoriesUsed: categoriesUsedAcross(habits),
    };

    const alreadyUnlockedIds = new Set(unlockedAchievements.map((u) => u.id));
    const freshlyUnlocked: UnlockedAchievement[] = [];

    ACHIEVEMENTS.forEach((def) => {
      if (!alreadyUnlockedIds.has(def.id) && def.isUnlocked(ctx)) {
        freshlyUnlocked.push({ id: def.id, unlockedAt: new Date().toISOString() });
      }
    });

    if (freshlyUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...freshlyUnlocked]);
      const defs = freshlyUnlocked
        .map((u) => ACHIEVEMENTS.find((a) => a.id === u.id))
        .filter((a): a is (typeof ACHIEVEMENTS)[number] => Boolean(a))
        .map((a) => ({ ...a, unlocked: true, unlockedAt: new Date().toISOString() }));
      setNewlyUnlocked((prev) => [...prev, ...defs]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  const addHabit = useCallback((draft: HabitDraft): Habit => {
    const habit: Habit = {
      ...draft,
      id: generateId(),
      createdAt: new Date().toISOString(),
      archived: false,
      completions: [],
    };
    setHabits((prev) => [habit, ...prev]);
    toast.success(`"${habit.name}" created`);
    return habit;
  }, []);

  const updateHabit = useCallback((id: string, draft: HabitDraft) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...draft } : h)));
    toast.success('Habit updated');
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast.success('Habit deleted');
  }, []);

  const archiveHabit = useCallback((id: string, archived: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived } : h)));
    toast.success(archived ? 'Habit archived' : 'Habit restored');
  }, []);

  const toggleCompletion = useCallback((id: string, date: string = todayString()) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const isDone = h.completions.includes(date);
        const completions = isDone
          ? h.completions.filter((c) => c !== date)
          : [...h.completions, date].sort();
        return { ...h, completions };
      })
    );
  }, []);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const replaceAllData = useCallback((payload: ExportPayload) => {
    setHabits(payload.habits);
    setUnlockedAchievements(payload.unlockedAchievements);
    toast.success('Data imported successfully');
  }, []);

  const achievements = useMemo<AchievementProgress[]>(() => {
    const unlockedMap = new Map(unlockedAchievements.map((u) => [u.id, u.unlockedAt]));
    return ACHIEVEMENTS.map((def) => ({
      ...def,
      unlocked: unlockedMap.has(def.id),
      unlockedAt: unlockedMap.get(def.id),
    }));
  }, [unlockedAchievements]);

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter((h) => h.archived), [habits]);

  const value = useMemo<HabitContextValue>(
    () => ({
      habits,
      activeHabits,
      archivedHabits,
      isLoading,
      addHabit,
      updateHabit,
      deleteHabit,
      archiveHabit,
      toggleCompletion,
      achievements,
      newlyUnlocked,
      clearNewlyUnlocked,
      replaceAllData,
      unlockedAchievements,
    }),
    [
      habits,
      activeHabits,
      archivedHabits,
      isLoading,
      addHabit,
      updateHabit,
      deleteHabit,
      archiveHabit,
      toggleCompletion,
      achievements,
      newlyUnlocked,
      clearNewlyUnlocked,
      replaceAllData,
      unlockedAchievements,
    ]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within a HabitProvider');
  return ctx;
}
