'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { Button } from './ui/Button';
import { PageLoader } from './ui/Misc';

// Auth talab qiladigan sahifalar uchun o'rovchi
export function RequireAuth({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const t = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Hidratsiya tugaguncha kutamiz (localStorage clientda o'qiladi)
  if (!mounted) return <PageLoader />;

  if (!accessToken) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Lock size={28} />
          </span>
          <h2 className="text-xl font-bold text-ink">{t.auth.requireTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.auth.requireText}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login">
              <Button>{t.common.login}</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">{t.common.register}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
