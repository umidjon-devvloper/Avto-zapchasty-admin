'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Eye, Truck, Phone, MessageCircle, ShieldCheck, Store, ChevronLeft, ImageOff, Tag, Share2,
} from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { auth } from '@/lib/auth';
import { formatPrice, resolveImage, timeAgo, formatPhone } from '@/lib/utils';
import { useT, useLocalize, useLocalizePart } from '@/lib/i18n';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ListingCard } from '@/components/ListingCard';
import { Badge, PageLoader, EmptyState } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

export function ListingClient({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const t = useT();
  const lz = useLocalize();
  const lzp = useLocalizePart();
  const [showPhone, setShowPhone] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.listing(id),
    enabled: !!id,
  });

  // Sotuvchining shu e'londan boshqa faol e'lonlari
  const sellerId = listing && typeof listing.sellerId === 'object' ? listing.sellerId?._id : undefined;
  const { data: sellerListings } = useQuery({
    queryKey: ['seller-other', sellerId, id],
    queryFn: () => api.search({ sellerId, sort: 'newest', limit: 12 }),
    enabled: !!sellerId,
  });
  const otherListings = (sellerListings?.items ?? []).filter((l) => l._id !== id).slice(0, 10);

  if (isLoading) return <PageLoader />;
  if (isError || !listing)
    return (
      <div className="container-page">
        <EmptyState
          title={t.listing.notFoundTitle}
          text={t.listing.notFoundText}
          action={<Link href="/search"><Button>{t.listing.backToSearch}</Button></Link>}
        />
      </div>
    );

  const seller = listing.sellerId;
  const brand = listing.fitment?.brandId;
  const model = listing.fitment?.modelId;
  const brandName = typeof brand === 'object' ? brand?.name : undefined;
  const modelName = typeof model === 'object' ? model?.name : undefined;

  const startChat = async () => {
    if (!auth.isAuthed()) {
      toast.show(t.messages.loginToWrite, 'info');
      router.push('/login');
      return;
    }
    setChatBusy(true);
    try {
      const conversationId = await api.getOrCreateConversation(listing._id);
      router.push(`/messages/${conversationId}`);
    } catch (e) {
      toast.show(errMessage(e), 'error');
    } finally {
      setChatBusy(false);
    }
  };

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.show(t.listing.linkCopied, 'success');
      }
    } catch {
      /* foydalanuvchi bekor qildi */
    }
  };

  return (
    <div className="container-page py-6">
      <button onClick={() => router.back()} className="group mb-4 flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink">
        <ChevronLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" /> {t.common.back}
      </button>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 animate-fade-up">
          <Gallery photos={listing.photos} title={listing.title} listingId={listing._id} isFavorite={listing.isFavorite} />

          {listing.description && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-ink">{t.listing.description}</h2>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/90">{listing.description}</p>
            </section>
          )}

          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-ink">{t.listing.specs}</h2>
            <dl className="overflow-hidden rounded-lg border border-line">
              <Row label={t.listing.condition} value={t.conditions[listing.condition] || listing.condition} />
              {listing.manufacturer && <Row label={t.listing.manufacturer} value={listing.manufacturer} />}
              {listing.partTypeId?.name && <Row label={t.listing.partType} value={lzp(listing.partTypeId)} />}
              {listing.categoryId && <Row label={t.listing.category} value={lz(listing.categoryId.name)} />}
              {(brandName || modelName) && (
                <Row label={t.listing.fitment} value={[brandName, modelName].filter(Boolean).join(' ')} />
              )}
              {listing.oemNumbers?.length > 0 && (
                <Row
                  label={t.listing.oemNumbers}
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {listing.oemNumbers.map((n: string) => (
                        <code key={n} className="rounded bg-surface px-2 py-0.5 font-mono text-[13px] text-ink">
                          {n}
                        </code>
                      ))}
                    </div>
                  }
                />
              )}
              <Row label={t.listing.delivery} value={listing.delivery ? t.common.yes : t.common.no} />
            </dl>
          </section>
        </div>

        <aside className="animate-fade-up lg:sticky lg:top-24 lg:self-start" style={{ animationDelay: '100ms' }}>
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-extrabold leading-snug text-ink">{listing.title}</h1>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={onShare}
                  aria-label={t.listing.share}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-amber/50 hover:bg-amber-50 hover:text-amber-700"
                >
                  <Share2 size={19} />
                </button>
                <FavoriteButton id={listing._id} initial={listing.isFavorite} size={22} className="h-10 w-10 border border-line" />
              </div>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-ink">
                {formatPrice(listing.price?.amount, listing.price?.currency)}
              </span>
              {listing.negotiable && <Badge tone="neutral">{t.listing.negotiable}</Badge>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
              {listing.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={15} /> {listing.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye size={15} /> {listing.views}
              </span>
              {listing.delivery && (
                <span className="flex items-center gap-1 text-success">
                  <Truck size={15} /> {t.listing.delivery}
                </span>
              )}
              <span>{timeAgo(listing.createdAt)}</span>
            </div>

            <div className="mt-5 space-y-2.5">
              {showPhone ? (
                <a href={`tel:${listing.phone}`} className="block">
                  <Button className="w-full" size="lg">
                    <Phone size={18} /> {formatPhone(listing.phone)}
                  </Button>
                </a>
              ) : (
                <Button className="w-full" size="lg" onClick={() => setShowPhone(true)} disabled={!listing.phone}>
                  <Phone size={18} /> {t.listing.showPhone}
                </Button>
              )}
              <Button variant="outline" className="w-full" size="lg" onClick={startChat} loading={chatBusy}>
                <MessageCircle size={18} /> {t.listing.writeMessage}
              </Button>
            </div>
          </div>

          {seller && (
            <div className="card mt-4 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{t.listing.seller}</p>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-amber-700">
                  {seller.sellerProfile?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveImage(seller.sellerProfile.avatar)} alt="" className="h-full w-full object-cover" />
                  ) : seller.sellerProfile?.shopName ? (
                    <Store size={22} />
                  ) : (
                    <span className="text-lg font-bold">{(seller.name || 'S')[0].toUpperCase()}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-bold text-ink">
                    {seller.sellerProfile?.shopName || seller.name || t.listing.sellerFallback}
                    {seller.sellerProfile?.verified && <ShieldCheck size={16} className="text-info" />}
                  </p>
                  {seller.sellerProfile?.city && <p className="text-sm text-muted">{seller.sellerProfile.city}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber/30 bg-amber-50/60 p-3 text-xs text-amber-700">
            <Tag size={26} className="shrink-0" />
            <p>{t.listing.safetyNote}</p>
          </div>
        </aside>
      </div>

      {/* Sotuvchining boshqa e'lonlari */}
      {otherListings.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">{t.listing.sellerOther}</h2>
            {sellerId && (
              <Link href={`/search?sellerId=${sellerId}`} className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                {t.home.viewAll}
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {otherListings.map((l, i) => (
              <ListingCard key={l._id} listing={l} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-b border-line px-4 py-3 last:border-b-0 odd:bg-surface/40">
      <dt className="w-40 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function Gallery({
  photos,
  title,
  listingId,
  isFavorite,
}: {
  photos: string[];
  title: string;
  listingId: string;
  isFavorite?: boolean;
}) {
  const imgs = (photos || []).filter(Boolean).map(resolveImage);
  const [active, setActive] = useState(0);

  if (imgs.length === 0) {
    return (
      <div className="img-skeleton flex aspect-[4/3] items-center justify-center rounded-lg">
        <ImageOff size={48} className="text-muted/40" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-card">
        <Image
          key={active}
          src={imgs[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 700px"
          className="animate-fade-in object-contain"
          priority
        />
        <div className="absolute right-3 top-3">
          <FavoriteButton id={listingId} initial={isFavorite} size={20} className="h-10 w-10 shadow-card" />
        </div>
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 hover:scale-105 ${i === active ? 'border-navy ring-2 ring-navy/25' : 'border-line opacity-70 hover:opacity-100'}`}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
