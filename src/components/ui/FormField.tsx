import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink dark:text-paper">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink/50 dark:text-paper/50">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-clay-500">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-10 rounded-lg border border-ink/15 dark:border-paper/15 bg-white dark:bg-charcoal-softer px-3 text-sm text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40',
            error && 'border-clay-500',
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextInput.displayName = 'TextInput';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint}>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          rows={3}
          className={cn(
            'rounded-lg border border-ink/15 dark:border-paper/15 bg-white dark:bg-charcoal-softer px-3 py-2 text-sm text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 resize-none',
            error && 'border-clay-500',
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextArea.displayName = 'TextArea';
