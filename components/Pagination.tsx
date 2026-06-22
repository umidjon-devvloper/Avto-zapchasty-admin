'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  if (pages <= 1) return null;

  // Ko'rsatiladigan sahifa raqamlari (joriy atrofida)
  const nums: (number | '…')[] = [];
  const push = (n: number | '…') => nums.push(n);
  const range = (a: number, b: number) => {
    for (let i = a; i <= b; i++) push(i);
  };

  if (pages <= 7) {
    range(1, pages);
  } else {
    push(1);
    if (page > 3) push('…');
    range(Math.max(2, page - 1), Math.min(pages - 1, page + 1));
    if (page < pages - 2) push('…');
    push(pages);
  }

  const btn = 'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors';

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={cn(btn, 'border-line bg-card text-ink hover:bg-surface disabled:opacity-40')}
      >
        <ChevronLeft size={18} />
      </button>

      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              btn,
              n === page
                ? 'border-navy bg-navy text-white'
                : 'border-line bg-card text-ink hover:bg-surface'
            )}
          >
            {n}
          </button>
        )
      )}

      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={cn(btn, 'border-line bg-card text-ink hover:bg-surface disabled:opacity-40')}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
