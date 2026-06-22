'use client';

import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const [locale, setLocale] = useLocale();

  return (
    <div className={cn('flex items-center rounded-md border border-line bg-card p-0.5', className)}>
      {(['uz', 'ru'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            'rounded px-2 py-1 text-xs font-bold uppercase transition-colors',
            locale === l ? 'bg-navy text-white' : 'text-muted hover:text-ink'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
