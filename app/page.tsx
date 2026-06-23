'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Truck, Search as SearchIcon, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { Reveal } from '@/components/Reveal';


export default function HomePage() {
  const t = useT();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.categories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands', 'popular'], queryFn: () => api.brands(true) });
  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-listings'],
    queryFn: () => api.search({ sort: 'newest', limit: 10 }),
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-navy-50 via-bg to-amber-50/60">
        {/* Dekorativ suzuvchi bloklar — navy + orange */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-16 -top-16 h-64 w-64 animate-float rounded-full bg-navy-100/50 blur-3xl" />
          <div
            className="absolute -right-10 top-10 h-72 w-72 animate-float rounded-full bg-amber-100/50 blur-3xl"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <div className="container-page relative py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex animate-fade-up items-center gap-1.5 rounded-full border border-amber/30 bg-card px-3 py-1 text-xs font-semibold text-amber-700">
              <Tag size={13} /> {t.home.badge}
            </span>
            <h1
              className="mt-4 animate-fade-up text-3xl font-extrabold leading-tight tracking-tight text-navy-800 sm:text-5xl"
              style={{ animationDelay: '80ms' }}
            >
              {t.home.heroTitle1} <span className="text-amber-600">{t.home.heroTitle2}</span>
            </h1>
            <p
              className="mt-4 animate-fade-up text-base text-muted sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              {t.home.heroSubtitle}
            </p>
            <div className="mx-auto mt-7 max-w-xl animate-fade-up" style={{ animationDelay: '240ms' }}>
              <SearchBar size="lg" />
            </div>
          </div>

          {/* Afzalliklar */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: <SearchIcon size={18} />, title: t.home.feat1Title, text: t.home.feat1Text },
              { icon: <ShieldCheck size={18} />, title: t.home.feat2Title, text: t.home.feat2Text },
              { icon: <Truck size={18} />, title: t.home.feat3Title, text: t.home.feat3Text },
            ].map((f, i) => (
              <div
                key={i}
                className="animate-fade-up"
                style={{ animationDelay: `${320 + i * 80}ms` }}
              >
                <Feature icon={f.icon} title={f.title} text={f.text} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORIYALAR */}
      <section id="categories" className="container-page py-12">
        <SectionHead title={t.home.categories} href="/search" linkLabel={t.home.viewAll} />
        {categories.length === 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="img-skeleton h-28 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((c, i) => (
              <CategoryCard key={c._id} category={c} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* MASHHUR BRENDLAR */}
      {brands.length > 0 && (
        <section className="container-page pb-4">
          <SectionHead title={t.home.popularBrands} />
          <div className="flex flex-wrap gap-2.5">
            {brands.slice(0, 18).map((b) => (
              <Link
                key={b._id}
                href={`/search?brandId=${b._id}`}
                className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:bg-amber-50 hover:shadow-card"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* YANGI E'LONLAR */}
      <section className="container-page py-12">
        <SectionHead title={t.home.newListings} href="/search?sort=newest" linkLabel={t.home.viewAll} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recentLoading
            ? Array.from({ length: 10 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : recent?.items.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
        </div>
        {!recentLoading && (!recent || recent.items.length === 0) && (
          <p className="py-12 text-center text-muted">{t.home.noListings}</p>
        )}
      </section>
    </>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-line bg-card/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber/40 hover:bg-card hover:shadow-card">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-muted">{text}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
