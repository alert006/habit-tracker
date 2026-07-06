import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { habitFormSchema, type HabitFormValues } from '@/utils/habitFormSchema';
import { TextInput, TextArea } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { CATEGORIES, HABIT_COLORS, HABIT_ICONS } from '@/data/categories';
import type { Habit, HabitDraft } from '@/types/habit';
import { cn } from '@/utils/cn';

interface HabitFormProps {
  initialHabit?: Habit;
  onSubmit: (draft: HabitDraft) => void;
  onCancel: () => void;
}

const WEEKDAYS = [
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
  { value: 0, label: 'S' },
];

const defaultValues: HabitFormValues = {
  name: '',
  description: '',
  categoryId: CATEGORIES[0].id,
  color: HABIT_COLORS[0],
  icon: HABIT_ICONS[0],
  frequency: 'daily',
  customDays: [],
  timesPerWeek: 3,
};

export function HabitForm({ initialHabit, onSubmit, onCancel }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: initialHabit
      ? {
          name: initialHabit.name,
          description: initialHabit.description,
          categoryId: initialHabit.categoryId,
          color: initialHabit.color,
          icon: initialHabit.icon,
          frequency: initialHabit.frequency,
          customDays: initialHabit.customDays,
          timesPerWeek: initialHabit.timesPerWeek,
        }
      : defaultValues,
  });

  const frequency = watch('frequency');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const selectedCategory = watch('categoryId');

  // Keep the swatch in sync with the chosen category by default, without
  // overriding a color the user picked manually after that.
  useEffect(() => {
    if (!initialHabit) {
      const category = CATEGORIES.find((c) => c.id === selectedCategory);
      if (category) setValue('color', category.color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const submit = (values: HabitFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() ?? '',
      categoryId: values.categoryId,
      color: values.color,
      icon: values.icon,
      frequency: values.frequency,
      customDays: values.customDays,
      timesPerWeek: values.timesPerWeek,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
      <TextInput label="Name" placeholder="Drink 8 glasses of water" error={errors.name?.message} {...register('name')} />

      <TextArea
        label="Notes"
        placeholder="Optional details or motivation"
        error={errors.description?.message}
        {...register('description')}
      />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">Category</span>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => field.onChange(category.id)}
                  aria-pressed={field.value === category.id}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    field.value === category.id
                      ? 'text-white'
                      : 'bg-ink/5 text-ink/70 hover:bg-ink/10 dark:bg-paper/10 dark:text-paper/70'
                  )}
                  style={field.value === category.id ? { backgroundColor: category.color } : undefined}
                >
                  <DynamicIcon name={category.icon} className="h-3.5 w-3.5" />
                  {category.name}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">Icon</span>
        <div className="grid grid-cols-9 gap-2">
          {HABIT_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              aria-pressed={selectedIcon === icon}
              aria-label={`Use ${icon} icon`}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                selectedIcon === icon
                  ? 'border-moss-600 bg-moss-100 dark:bg-moss-900/40'
                  : 'border-ink/10 dark:border-paper/10 hover:bg-ink/5 dark:hover:bg-paper/10'
              )}
            >
              <DynamicIcon name={icon} className="h-4.5 w-4.5 text-ink/70 dark:text-paper/70" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">Color</span>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              aria-pressed={selectedColor === color}
              aria-label={`Use color ${color}`}
              className={cn(
                'h-8 w-8 rounded-full ring-offset-2 ring-offset-paper dark:ring-offset-charcoal-soft transition-all',
                selectedColor === color && 'ring-2 ring-ink dark:ring-paper'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">Frequency</span>
        <div className="grid grid-cols-3 gap-2">
          {(['daily', 'weekly', 'custom'] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setValue('frequency', freq)}
              aria-pressed={frequency === freq}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors',
                frequency === freq
                  ? 'border-moss-600 bg-moss-600 text-white'
                  : 'border-ink/15 dark:border-paper/15 text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/10'
              )}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label htmlFor="timesPerWeek" className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">
            Times per week
          </label>
          <input
            id="timesPerWeek"
            type="number"
            min={1}
            max={7}
            {...register('timesPerWeek', { valueAsNumber: true })}
            className="h-10 w-24 rounded-lg border border-ink/15 dark:border-paper/15 bg-white dark:bg-charcoal-softer px-3 text-sm text-ink dark:text-paper"
          />
        </div>
      )}

      {frequency === 'custom' && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink dark:text-paper">Active days</span>
          <Controller
            name="customDays"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {WEEKDAYS.map((day) => {
                  const isActive = field.value.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() =>
                        field.onChange(
                          isActive
                            ? field.value.filter((d) => d !== day.value)
                            : [...field.value, day.value]
                        )
                      }
                      aria-pressed={isActive}
                      aria-label={`Toggle ${day.label}`}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                        isActive
                          ? 'border-moss-600 bg-moss-600 text-white'
                          : 'border-ink/15 dark:border-paper/15 text-ink/60 dark:text-paper/60 hover:bg-ink/5 dark:hover:bg-paper/10'
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.customDays && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-clay-500">
              {errors.customDays.message}
            </p>
          )}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialHabit ? 'Save changes' : 'Create habit'}
        </Button>
      </div>
    </form>
  );
}
