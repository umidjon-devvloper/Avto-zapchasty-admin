'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Car, DoorOpen, Package, Lightbulb, AppWindow, Droplets, Wrench, Navigation, Disc, Cog,
  Zap, Fuel, Wind, CloudFog, Thermometer, Filter, Settings, GitMerge, Snowflake,
  Armchair, ShieldCheck, CircleDot, FlaskConical, Boxes, BatteryCharging, PlugZap, Fan,
  Radio, Scan, Speaker, Bolt, Sparkles, ChevronRight, ArrowLeft, type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLocalize, useLocalizePart } from '@/lib/i18n';
import type { PartCategory, PartType } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  podkapot: Cog,
  body: Car,
  doors: DoorOpen,
  trunk: Package,
  lights: Lightbulb,
  'glass-mirrors': AppWindow,
  wipers: Droplets,
  suspension: Wrench,
  steering: Navigation,
  brakes: Disc,
  engine: Cog,
  ignition: Zap,
  'fuel-system': Fuel,
  intake: Wind,
  exhaust: CloudFog,
  cooling: Thermometer,
  filters: Filter,
  transmission: Settings,
  drivetrain: GitMerge,
  electrical: Zap,
  sensors: Radio,
  climate: Snowflake,
  interior: Armchair,
  safety: ShieldCheck,
  'wheels-tires': CircleDot,
  'oils-fluids': FlaskConical,
  consumables: Boxes,
  hybrid: BatteryCharging,
  'electric-vehicle': PlugZap,
  turbo: Fan,
  adas: Scan,
  audio: Speaker,
  fasteners: Bolt,
  tuning: Sparkles,
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container-page py-8" />}>
      <CategoryContent />
    </Suspense>
  );
}

// Ikki tonli premium sxema — CategoryCard bilan bir xil ritm
const TONES = [
  {
    badge: 'from-amber-50 to-amber-100 text-amber-600 ring-amber/10',
    badgeHover: 'group-hover:from-amber-100 group-hover:to-amber-50 group-hover:text-amber-700 group-hover:ring-amber/30',
    border: 'hover:border-amber/50',
  },
  {
    badge: 'from-navy-50 to-navy-100 text-navy-600 ring-navy/10',
    badgeHover: 'group-hover:from-navy-100 group-hover:to-navy-50 group-hover:text-navy-700 group-hover:ring-navy/30',
    border: 'hover:border-navy-200',
  },
];

function CategoryContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const level = sp.get('level') === '2' ? 2 : 1;
  const name = sp.get('name') || 'Kategoriya';
  const slug = sp.get('slug') || '';
  const parentName = sp.get('parentName') || '';
  const parentId = sp.get('parentId') || '';
  const lz = useLocalize();
  const lzp = useLocalizePart();
  const HeroIcon = ICONS[slug] || Wrench;

  const { data: subs, isLoading: subsLoading } = useQuery({
    queryKey: ['subcategories', id],
    queryFn: () => api.subcategories(id),
    enabled: level === 1,
  });

  const { data: partTypes, isLoading: ptLoading } = useQuery({
    queryKey: ['part-types', id],
    queryFn: () => api.categoryPartTypes(id),
    enabled: level === 2,
  });

  const isLoading = level === 1 ? subsLoading : ptLoading;

  const backHref =
    level === 2 && parentId
      ? `/category/${parentId}?name=${encodeURIComponent(parentName)}`
      : '/';

  return (
    <div>
      {/* HERO — kategoriya banneri */}
      <section className="relative overflow-hidden border-b border-line bg-navy-800 text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900" />
          <div className="absolute inset-0 bg-hero-grid bg-[length:40px_40px] opacity-[0.15]" />
          <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        <div className="container-page relative py-8 sm:py-10">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-sm text-navy-100/80">
            <button
              onClick={() => router.push(backHref)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={14} />
              {level === 2 ? (parentName || 'Orqaga') : 'Bosh sahifa'}
            </button>
            <ChevronRight size={13} className="opacity-40" />
            <span className="truncate font-semibold text-white">{name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 text-amber-300 ring-1 ring-amber/20 sm:h-16 sm:w-16">
              <HeroIcon size={28} strokeWidth={2} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{name}</h1>
              <p className="mt-1 text-sm text-navy-100/80">
                {level === 1
                  ? `${(subs ?? []).length || ''} bo'lim ${(subs ?? []).length ? '· ' : ''}kerakli bo'limni tanlang`
                  : "aniq detal turini tanlang"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        ) : level === 1 ? (
          /* ── Level 1 → show Level 2 subcategories ── */
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(subs ?? []).length === 0 ? (
              <p className="col-span-2 py-12 text-center text-sm text-muted">
                Bu kategoriyada pastki bo'limlar yo'q
              </p>
            ) : (
              (subs ?? []).map((sub: PartCategory, i: number) => {
                const Icon = ICONS[sub.slug] || Wrench;
                const subName = lz(sub.name);
                const tone = TONES[i % TONES.length];
                return (
                  <Link
                    key={sub._id}
                    href={`/category/${sub._id}?level=2&name=${encodeURIComponent(subName)}&slug=${sub.slug}&parentName=${encodeURIComponent(name)}&parentId=${id}`}
                    style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                    className={`group flex animate-fade-up items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-hover motion-reduce:animate-none motion-reduce:transform-none ${tone.border}`}
                  >
                    <span
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 transition-all duration-300 group-hover:scale-110 ${tone.badge} ${tone.badgeHover}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink">{subName}</span>
                    <ChevronRight
                      size={16}
                      className="text-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                );
              })
            )}
          </div>
        ) : (
          /* ── Level 2 → show PartTypes ── */
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(partTypes ?? []).length === 0 ? (
              <p className="col-span-full py-12 text-center text-sm text-muted">
                Bu bo'limda detal turlari yo'q
              </p>
            ) : (
              (partTypes ?? []).map((pt: PartType, i: number) => {
                const tone = TONES[i % TONES.length];
                return (
                  <Link
                    key={pt._id}
                    href={`/search?partTypeId=${pt._id}`}
                    style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                    className={`group flex animate-fade-up items-center gap-3.5 rounded-2xl border border-line bg-card px-4 py-3.5 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-hover motion-reduce:animate-none motion-reduce:transform-none ${tone.border}`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-all duration-300 group-hover:scale-110 ${tone.badge} ${tone.badgeHover}`}
                    >
                      <Bolt size={17} strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink">{lzp(pt)}</span>
                    <ChevronRight
                      size={15}
                      className="text-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
