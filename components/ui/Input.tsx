import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>}
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-md border border-line bg-card px-3.5 text-[15px] text-ink',
          'placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, className, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>}
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink',
          'placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15',
          className
        )}
        {...props}
      />
    </label>
  );
});

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, className, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>}
      <select
        ref={ref}
        className={cn(
          'h-11 w-full rounded-md border border-line bg-card px-3 text-[15px] text-ink',
          'focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
});
