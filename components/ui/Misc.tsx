import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('animate-spin text-amber', className)} />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Image
        src="/harf-logo.png"
        alt="Zapchasty"
        width={72}
        height={72}
        priority
        className="h-16 w-16 animate-pulse object-contain mix-blend-multiply"
      />
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'amber' | 'success' | 'danger' | 'info';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-chip text-muted',
    amber: 'bg-amber-50 text-amber-700',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-muted/60">{icon}</div>}
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
