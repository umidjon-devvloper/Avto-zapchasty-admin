'use client';

import { useSyncExternalStore } from 'react';

export type Locale = 'uz' | 'ru';

const KEY = 'ap-locale';
let locale: Locale = 'uz';
const listeners = new Set<() => void>();

function load() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem(KEY);
  if (saved === 'uz' || saved === 'ru') locale = saved;
}
load();

export const localeStore = {
  get: () => locale,
  set(l: Locale) {
    locale = l;
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEY, l);
      document.documentElement.lang = l;
    }
    listeners.forEach((fn) => fn());
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

// Joriy tilni kuzatuvchi hook (SSR-xavfsiz, server'da har doim 'uz')
export function useLocale(): [Locale, (l: Locale) => void] {
  const value = useSyncExternalStore(
    localeStore.subscribe,
    () => localeStore.get(),
    () => 'uz' as Locale
  );
  return [value, localeStore.set];
}
