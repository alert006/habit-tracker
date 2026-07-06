import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-moss-600 text-white hover:bg-moss-700 active:bg-moss-800 shadow-soft disabled:bg-moss-600/50',
  secondary:
    'bg-moss-100 text-moss-800 hover:bg-moss-200 dark:bg-moss-900/40 dark:text-moss-200 dark:hover:bg-moss-900/70',
  outline:
    'border border-ink/15 dark:border-paper/15 text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/5',
  ghost: 'text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/10',
  danger: 'bg-clay-500 text-white hover:bg-clay-500/90 shadow-soft disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
  icon: 'h-10 w-10 rounded-xl justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
