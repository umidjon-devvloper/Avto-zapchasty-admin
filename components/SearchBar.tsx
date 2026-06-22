'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function SearchBar({
  size = 'md',
  initial = '',
  className,
}: {
  size?: 'md' | 'lg';
  initial?: string;
  className?: string;
}) {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggest', debounced],
    queryFn: () => api.suggest(debounced),
    enabled: debounced.length >= 2,
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (term: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={boxRef} className={cn('relative w-full', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(q.trim());
        }}
        className="flex w-full"
      >
        <div className="relative flex-1">
          <Search
            size={size === 'lg' ? 22 : 18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t.common.searchPlaceholder}
            className={cn(
              'w-full rounded-l-md border border-r-0 border-line bg-card text-ink placeholder:text-muted/70',
              'focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15',
              size === 'lg' ? 'h-14 pl-12 pr-4 text-base' : 'h-11 pl-11 pr-3 text-[15px]'
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            'rounded-r-md bg-navy font-semibold text-white transition-colors hover:bg-navy-700',
            size === 'lg' ? 'px-7 text-base' : 'px-5 text-sm'
          )}
        >
          {t.common.search}
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-md border border-line bg-card shadow-hover">
          {suggestions.slice(0, 8).map((s) => (
            <button
              key={s._id}
              onClick={() => go(s.name)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink hover:bg-surface"
            >
              <Search size={15} className="text-muted" />
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
