'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Eye, Heart, Trash2, CheckCircle2, RotateCcw, ImageOff, Plus, Pencil } from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { formatPrice, resolveImage, timeAgo } from '@/lib/utils';
import { useT, type Dict } from '@/lib/i18n';
import type { Listing, ListingStatus } from '@/lib/types';
import { RequireAuth } from '@/components/RequireAuth';
import { ListingCardSkeleton } from '@/components/ListingCard';
import { EmptyState, Badge } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListingsContent />
    </RequireAuth>
  );
}

const statusTone: Record<ListingStatus, 'success' | 'amber' | 'danger' | 'neutral' | 'info'> = {
  active: 'success',
  pending: 'amber',
  sold: 'info',
  rejected: 'danger',
  draft: 'neutral',
  archived: 'neutral',
};

function MyListingsContent() {
  const qc = useQueryClient();
  const toast = useToast();
  const t = useT();
  const { data, isLoading } = useQuery({ queryKey: ['my-listings'], queryFn: api.myListings });

  const del = useMutation({
    mutationFn: (id: string) => api.deleteListing(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-listings'] });
      toast.show(t.myListings.deleted, 'success');
    },
    onError: (e) => toast.show(errMessage(e), 'error'),
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.setListingStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-listings'] }),
    onError: (e) => toast.show(errMessage(e), 'error'),
  });

  return (
    <div className="container-page py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">{t.myListings.title}</h1>
        <Link href="/sell">
          <Button size="sm">
            <Plus size={16} /> {t.myListings.newListing}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((l) => (
            <MyRow
              key={l._id}
              t={t}
              listing={l}
              onDelete={() => {
                if (confirm(t.myListings.confirmDelete)) del.mutate(l._id);
              }}
              onToggleSold={() =>
                setStatus.mutate({ id: l._id, status: l.status === 'sold' ? 'active' : 'sold' })
              }
              busy={del.isPending || setStatus.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Package size={56} strokeWidth={1.4} />}
          title={t.myListings.emptyTitle}
          text={t.myListings.emptyText}
          action={<Link href="/sell"><Button>{t.common.sell}</Button></Link>}
        />
      )}
    </div>
  );
}

function MyRow({
  t,
  listing,
  onDelete,
  onToggleSold,
  busy,
}: {
  t: Dict;
  listing: Listing;
  onDelete: () => void;
  onToggleSold: () => void;
  busy: boolean;
}) {
  const photo = listing.photos?.[0] ? resolveImage(listing.photos[0]) : '';
  const sold = listing.status === 'sold';

  return (
    <div className="card flex gap-4 p-3">
      <Link href={`/listing/${listing._id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-28">
        {photo ? (
          <Image src={photo} alt={listing.title} fill sizes="112px" className="object-cover" />
        ) : (
          <div className="img-skeleton flex h-full w-full items-center justify-center">
            <ImageOff size={24} className="text-muted/40" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/listing/${listing._id}`} className="line-clamp-2 font-bold text-ink hover:text-amber-700">
            {listing.title}
          </Link>
          <Badge tone={statusTone[listing.status]}>{t.statuses[listing.status]}</Badge>
        </div>

        <p className="mt-1 text-lg font-extrabold text-ink">
          {formatPrice(listing.price?.amount, listing.price?.currency)}
        </p>

        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1"><Eye size={13} /> {listing.views}</span>
          <span className="flex items-center gap-1"><Heart size={13} /> {listing.favoritesCount}</span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onToggleSold} disabled={busy}>
            {sold ? <><RotateCcw size={14} /> {t.myListings.activate}</> : <><CheckCircle2 size={14} /> {t.myListings.markSold}</>}
          </Button>
          <Link href={`/sell?edit=${listing._id}`}>
            <Button size="sm" variant="outline">
              <Pencil size={14} /> {t.myListings.edit}
            </Button>
          </Link>
          <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" onClick={onDelete} disabled={busy}>
            <Trash2 size={14} /> {t.myListings.delete}
          </Button>
        </div>
      </div>
    </div>
  );
}
