'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const t = useT();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Image
        src="/harf-logo.png"
        alt="Zapchasty"
        width={80}
        height={80}
        className="mb-4 h-20 w-20 animate-float object-contain opacity-90 mix-blend-multiply"
      />
      <p className="text-7xl font-extrabold text-amber">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink">{t.notFound.title}</h1>
      <p className="mt-2 text-muted">{t.notFound.text}</p>
      <Link href="/" className="mt-6">
        <Button>{t.notFound.home}</Button>
      </Link>
    </div>
  );
}
