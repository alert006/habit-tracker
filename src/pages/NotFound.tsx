import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 dark:bg-moss-900/40">
        <Leaf className="h-7 w-7 text-moss-600 dark:text-moss-300" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">Page not found</h1>
      <p className="max-w-sm text-sm text-ink/60 dark:text-paper/60">
        This page doesn't exist. Let's get you back to your habits.
      </p>
      <Link
        to="/"
        className="inline-flex h-10 items-center rounded-xl bg-moss-600 px-4 text-sm font-medium text-white hover:bg-moss-700"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
