'use client';

import { useLocale } from './store';
import { dictionaries, type Dict } from './dictionaries';
import type { I18nName } from '@/lib/types';

export { useLocale } from './store';
export type { Locale } from './store';
export type { Dict } from './dictionaries';

// Joriy til lug'atini qaytaradi: const t = useT(); t.home.heroTitle
export function useT(): Dict {
  const [locale] = useLocale();
  return dictionaries[locale];
}

// Katalog I18nName (ru/uz) ni joriy tilga lokalizatsiya qiladi
export function useLocalize() {
  const [locale] = useLocale();
  return (name?: I18nName | string): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    if (locale === 'ru') return name.ru || name.uz || name.en || '';
    return name.uz || name.ru || name.en || '';
  };
}
