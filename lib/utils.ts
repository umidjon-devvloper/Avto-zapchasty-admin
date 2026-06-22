import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_ORIGIN } from './api';
import type { I18nName } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Narxni formatlash: 350000 -> "350 000 so'm"
export function formatPrice(amount?: number, currency = 'UZS'): string {
  if (amount == null) return '';
  const num = new Intl.NumberFormat('ru-RU').format(amount);
  const suffix = currency === 'USD' ? '$' : "so'm";
  return currency === 'USD' ? `$${num}` : `${num} ${suffix}`;
}

// Local (/uploads/...) URL'larni to'liq manzilga aylantiradi; absolute (http) URL o'zgarmaydi
export function resolveImage(u?: string): string {
  if (!u) return '';
  return u.startsWith('http') ? u : API_ORIGIN + u;
}

// I18n nomdan o'zbekchani (yoki ruschani) olish
export function i18n(name?: I18nName | string): string {
  if (!name) return '';
  if (typeof name === 'string') return name;
  return name.uz || name.ru || name.en || '';
}

// "3 daqiqa oldin" ko'rinishidagi vaqt
export function timeAgo(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'hozir';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} kun oldin`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} oy oldin`;
  return `${Math.floor(mo / 12)} yil oldin`;
}

// O'zbek telefon raqamini chiroyli ko'rsatish: +998901234567 -> +998 90 123 45 67
export function formatPhone(phone?: string): string {
  if (!phone) return '';
  const d = phone.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('998')) {
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
  }
  return phone;
}
