'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  // Asosiy harakat — logodagi navy ko'k
  primary:
    'bg-navy text-white shadow-sm hover:bg-navy-700 hover:shadow-hover hover:-translate-y-0.5 active:bg-navy-800 disabled:bg-navy/50 disabled:shadow-none disabled:translate-y-0',
  // Urg'u CTA — logodagi to'q sariq chaqmoq
  accent:
    'bg-amber text-ink shadow-sm hover:bg-amber-600 hover:shadow-hover hover:-translate-y-0.5 active:bg-amber-700 disabled:bg-amber/50 disabled:shadow-none disabled:translate-y-0',
  outline: 'border border-line2 bg-card text-ink hover:bg-surface hover:border-navy/30 disabled:opacity-50',
  ghost: 'text-ink hover:bg-surface disabled:opacity-50',
  danger: 'bg-danger text-white hover:bg-danger/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 ease-out active:scale-[0.97] disabled:cursor-not-allowed motion-reduce:transform-none motion-reduce:transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
});
