import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        !color && 'bg-ink/5 text-ink/70 dark:bg-paper/10 dark:text-paper/70',
        className
      )}
      style={color ? { backgroundColor: `${color}1A`, color } : undefined}
    >
      {children}
    </span>
  );
}
