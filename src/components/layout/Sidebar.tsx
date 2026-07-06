import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { NAV_ITEMS } from '@/data/navigation';
import { cn } from '@/utils/cn';

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-ink/10 dark:border-paper/10 bg-paper-soft/60 dark:bg-charcoal-soft/60 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-600 text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-display text-xl font-semibold text-ink dark:text-paper">Sprout</span>
      </div>

      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-moss-600 text-white shadow-soft'
                  : 'text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10'
              )
            }
          >
            <DynamicIcon name={item.icon} className="h-4.5 w-4.5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <p className="px-2 text-xs text-ink/40 dark:text-paper/40">
        Grows with you, one day at a time.
      </p>
    </aside>
  );
}
