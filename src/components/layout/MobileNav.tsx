import { NavLink } from 'react-router-dom';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { NAV_ITEMS } from '@/data/navigation';
import { cn } from '@/utils/cn';

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-between border-t border-ink/10 dark:border-paper/10 bg-paper/95 dark:bg-charcoal-soft/95 backdrop-blur px-1 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-moss-600 dark:text-moss-300' : 'text-ink/50 dark:text-paper/50'
            )
          }
        >
          {({ isActive }) => (
            <>
              <DynamicIcon
                name={item.icon}
                className={cn('h-5 w-5', isActive && 'scale-110')}
                aria-hidden="true"
              />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
