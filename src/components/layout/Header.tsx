import { Moon, Sun, WifiOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 dark:border-paper/10 bg-paper/90 dark:bg-charcoal/90 backdrop-blur px-4 py-4 lg:px-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink dark:text-paper lg:text-2xl">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-ink/60 dark:text-paper/60">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {!isOnline && (
          <span
            className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
            role="status"
          >
            <WifiOff className="h-3.5 w-3.5" />
            Offline
          </span>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
