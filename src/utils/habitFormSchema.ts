import { z } from 'zod';

export const habitFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Give your habit a name.').max(60, 'Keep it under 60 characters.'),
    description: z.string().trim().max(200, 'Keep it under 200 characters.').optional().default(''),
    categoryId: z.string().min(1, 'Choose a category.'),
    color: z.string().min(1),
    icon: z.string().min(1),
    frequency: z.enum(['daily', 'weekly', 'custom']),
    customDays: z.array(z.number().int().min(0).max(6)).default([]),
    timesPerWeek: z.number().int().min(1).max(7).default(3),
  })
  .refine((data) => data.frequency !== 'custom' || data.customDays.length > 0, {
    message: 'Pick at least one day of the week.',
    path: ['customDays'],
  });

export type HabitFormValues = z.infer<typeof habitFormSchema>;
