'use client';

import { useSyncExternalStore } from 'react';
import type { User } from './types';

const KEY = 'ap-web-auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const empty: AuthState = { accessToken: null, refreshToken: null, user: null };

let state: AuthState = empty;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch {
    state = empty;
  }
}
load();

function persist() {
  if (typeof window === 'undefined') return;
  if (state.accessToken) localStorage.setItem(KEY, JSON.stringify(state));
  else localStorage.removeItem(KEY);
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export const auth = {
  getAccess: () => state.accessToken,
  getRefresh: () => state.refreshToken,
  getUser: () => state.user,
  isAuthed: () => !!state.accessToken,

  setSession(accessToken: string, refreshToken: string, user: User) {
    state = { accessToken, refreshToken, user };
    emit();
  },
  setTokens(accessToken: string, refreshToken: string) {
    state = { ...state, accessToken, refreshToken };
    emit();
  },
  setUser(user: User) {
    state = { ...state, user };
    emit();
  },
  clear() {
    state = empty;
    emit();
  },

  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  snapshot: () => state,
};

const serverSnapshot: AuthState = empty;

// React hook — auth holatini kuzatadi (SSR-xavfsiz)
export function useAuth() {
  return useSyncExternalStore(
    auth.subscribe,
    auth.snapshot,
    () => serverSnapshot
  );
}
