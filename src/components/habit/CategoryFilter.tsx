import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { CATEGORIES } from '@/data/categories';
import { cn } from '@/utils/cn';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={cn(
          'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
          selected === null
            ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
            : 'bg-ink/5 text-ink/70 hover:bg-ink/10 dark:bg-paper/10 dark:text-paper/70 dark:hover:bg-paper/20'
        )}
      >
        All
      </button>
      {CATEGORIES.map((category) => {
        const isActive = selected === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(isActive ? null : category.id)}
            aria-pressed={isActive}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-white'
                : 'bg-ink/5 text-ink/70 hover:bg-ink/10 dark:bg-paper/10 dark:text-paper/70 dark:hover:bg-paper/20'
            )}
            style={isActive ? { backgroundColor: category.color } : undefined}
          >
            <DynamicIcon name={category.icon} className="h-3.5 w-3.5" aria-hidden="true" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
