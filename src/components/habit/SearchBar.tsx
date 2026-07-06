import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search habits…' }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-paper/40"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search habits"
        id="habit-search"
        className="h-10 w-full rounded-xl border border-ink/15 dark:border-paper/15 bg-white dark:bg-charcoal-softer pl-9 pr-9 text-sm text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink/40 hover:bg-ink/5 dark:text-paper/40 dark:hover:bg-paper/10"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
