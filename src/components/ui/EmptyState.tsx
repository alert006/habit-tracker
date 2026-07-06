import type { ReactNode } from 'react';
import { DynamicIcon } from './DynamicIcon';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'Sprout', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink/15 dark:border-paper/15 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 dark:bg-moss-900/40">
        <DynamicIcon name={icon} className="h-7 w-7 text-moss-600 dark:text-moss-300" />
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-paper">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink/60 dark:text-paper/60">{description}</p>
      )}
      {action}
    </div>
  );
}
