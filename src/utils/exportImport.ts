import { z } from 'zod';
import type { ExportPayload, Habit, UnlockedAchievement } from '@/types/habit';

const habitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(500),
  categoryId: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  customDays: z.array(z.number().int().min(0).max(6)),
  timesPerWeek: z.number().int().min(1).max(7),
  createdAt: z.string(),
  archived: z.boolean(),
  completions: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

const unlockedSchema = z.object({
  id: z.string(),
  unlockedAt: z.string(),
});

const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  habits: z.array(habitSchema),
  unlockedAchievements: z.array(unlockedSchema),
});

export const buildExportPayload = (
  habits: Habit[],
  unlockedAchievements: UnlockedAchievement[]
): ExportPayload => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  habits,
  unlockedAchievements,
});

export const downloadExportFile = (payload: ExportPayload): void => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = payload.exportedAt.slice(0, 10);
  a.href = url;
  a.download = `sprout-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export type ParseResult =
  | { success: true; data: ExportPayload }
  | { success: false; error: string };

export const parseImportFile = (raw: string): ParseResult => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { success: false, error: 'That file is not valid JSON.' };
  }

  const result = exportSchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: 'This file does not match the expected Sprout backup format.',
    };
  }

  return { success: true, data: result.data as ExportPayload };
};

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
