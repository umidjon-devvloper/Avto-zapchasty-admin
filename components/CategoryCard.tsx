'use client';

import Link from 'next/link';
import {
  Car, DoorOpen, Package, Lightbulb, AppWindow, Droplets, Wrench, Navigation, Disc, Cog,
  Zap, Fuel, Wind, CloudFog, Thermometer, Filter, Settings, GitMerge, Radio, Snowflake,
  Armchair, ShieldCheck, CircleDot, FlaskConical, Boxes, BatteryCharging, PlugZap, Fan,
  Scan, Speaker, Bolt, Sparkles, type LucideIcon,
} from 'lucide-react';
import type { PartCategory } from '@/lib/types';
import { useLocalize } from '@/lib/i18n';

// Har bir kategoriya slug'iga mos lucide ikonka
const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
  diesel: Fuel,
  hybrid: BatteryCharging,
  'electric-vehicle': PlugZap,
  turbo: Fan,
  adas: Scan,
  audio: Speaker,
  fasteners: Bolt,
  tuning: Sparkles,
};

// Ikki tonli premium sxema — bir xil kategoriyada har doim bir xil rang bo'lishi uchun indeks bo'yicha almashadi
const TONES = [
  {
    badge: 'from-amber-50 to-amber-100 text-amber-600 ring-amber/10',
    badgeHover: 'group-hover:from-amber-100 group-hover:to-amber-50 group-hover:text-amber-700 group-hover:ring-amber/30',
    border: 'hover:border-amber/50',
    text: 'group-hover:text-amber-700',
  },
  {
    badge: 'from-navy-50 to-navy-100 text-navy-600 ring-navy/10',
    badgeHover: 'group-hover:from-navy-100 group-hover:to-navy-50 group-hover:text-navy-700 group-hover:ring-navy/30',
    border: 'hover:border-navy-200',
    text: 'group-hover:text-navy-700',
  },
];

export function CategoryCard({ category, index = 0 }: { category: PartCategory; index?: number }) {
  const lz = useLocalize();
  const name = lz(category.name);
  const Icon = CATEGORY_ICONS[category.slug] || Wrench;
  const tone = TONES[index % TONES.length];

  return (
    <Link
      href={`/category/${category._id}?name=${encodeURIComponent(name)}&slug=${category.slug}`}
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className={`group relative flex animate-fade-up flex-col items-center gap-3 overflow-hidden rounded-2xl border border-line bg-card p-4 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-hover motion-reduce:animate-none motion-reduce:transform-none sm:p-5 ${tone.border}`}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 transition-all duration-300 group-hover:scale-110 sm:h-16 sm:w-16 ${tone.badge} ${tone.badgeHover}`}
      >
        <Icon size={26} strokeWidth={2} className="transition-transform duration-300 group-hover:-rotate-6" />
      </span>
      <span className={`text-sm font-semibold leading-snug text-ink transition-colors ${tone.text}`}>{name}</span>
    </Link>
  );
}
