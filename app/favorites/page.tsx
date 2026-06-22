'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { RequireAuth } from '@/components/RequireAuth';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { EmptyState } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  return (
    <RequireAuth>
      <FavoritesContent />
    </RequireAuth>
  );
}

function FavoritesContent() {
  const t = useT();
  const { data, isLoading } = useQuery({ queryKey: ['favorites'], queryFn: api.favorites });

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-ink">{t.favorites.title}</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((l, i) => (
            <ListingCard key={l._id} listing={{ ...l, isFavorite: true }} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={56} strokeWidth={1.4} />}
          title={t.favorites.emptyTitle}
          text={t.favorites.emptyText}
          action={<Link href="/search"><Button>{t.favorites.browse}</Button></Link>}
        />
      )}
    </div>
  );
}
