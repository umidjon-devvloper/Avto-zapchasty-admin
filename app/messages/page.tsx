'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { resolveImage, timeAgo } from '@/lib/utils';
import { RequireAuth } from '@/components/RequireAuth';
import { EmptyState, PageLoader } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
  return (
    <RequireAuth>
      <MessagesContent />
    </RequireAuth>
  );
}

function MessagesContent() {
  const t = useT();
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: api.conversations,
    refetchInterval: 15_000,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-ink">{t.messages.title}</h1>

      {data && data.length > 0 ? (
        <div className="mx-auto max-w-2xl divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
          {data.map((c) => {
            const photo = c.listing?.photos?.[0] ? resolveImage(c.listing.photos[0]) : '';
            return (
              <Link key={c._id} href={`/messages/${c._id}`} className="flex items-center gap-3 p-3 transition-colors hover:bg-surface">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                  {photo ? (
                    <Image src={photo} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="img-skeleton flex h-full w-full items-center justify-center">
                      <ImageOff size={20} className="text-muted/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-bold text-ink">{c.other?.shopName || c.other?.name || t.messages.userFallback}</p>
                    <span className="shrink-0 text-xs text-muted">{timeAgo(c.lastMessage?.at || c.updatedAt)}</span>
                  </div>
                  <p className="truncate text-sm text-muted">{c.listing?.title || t.messages.listingDeleted}</p>
                  {c.lastMessage && <p className="truncate text-sm text-ink/80">{c.lastMessage.text}</p>}
                </div>
                {c.unread > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber px-1.5 text-xs font-bold text-ink">
                    {c.unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<MessageCircle size={56} strokeWidth={1.4} />}
          title={t.messages.emptyTitle}
          text={t.messages.emptyText}
          action={<Link href="/search"><Button>{t.messages.browse}</Button></Link>}
        />
      )}
    </div>
  );
}
