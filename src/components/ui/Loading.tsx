import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-ink/50 dark:text-paper/50">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-lg bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 dark:from-paper/5 dark:via-paper/10 dark:to-paper/5 bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}

export function HabitCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl2 border border-ink/10 dark:border-paper/10 p-4">
      <Skeleton className="h-11 w-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
  );
}
