'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, errMessage } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const sp = useSearchParams();
  const toast = useToast();
  const t = useT();
  const isRegister = mode === 'register';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  
  const next = sp.get('next') || '/';
  const canSubmit = phone.replace(/\D/g, '').length >= 7 && password.length >= 4;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      const r = isRegister
        ? await api.register(phone, password, name || undefined)
        : await api.login(phone, password);
      auth.setSession(r.accessToken, r.refreshToken, r.user);
      toast.show(isRegister ? t.auth.registered : t.auth.welcome, 'success');
      router.push(next);
    } catch (err) {
      toast.show(errMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Kvadrat logoning bo'sh joyini kesib, gorizontal logoni to'liq ko'rsatamiz */}
          <div className="relative mb-3 h-16 w-56 animate-scale-in overflow-hidden">
            <Image
              src="/logo.png"
              alt="Zapchasty"
              fill
              priority
              sizes="224px"
              className="object-cover mix-blend-multiply"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-ink">
            {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
          </p>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <Input
            label={t.auth.phone}
            type="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
          {isRegister && (
            <Input
              label={t.auth.nameOptional}
              placeholder={t.auth.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <Input
            label={t.auth.password}
            type="password"
            placeholder={t.auth.passwordHint}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />

          <Button type="submit" className="w-full" size="lg" loading={busy} disabled={!canSubmit}>
            {isRegister ? t.common.register : t.common.login}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isRegister ? t.auth.haveAccount : t.auth.noAccount}
          <Link
            href={isRegister ? '/login' : '/register'}
            className="font-semibold text-amber-600 hover:text-amber-700"
          >
            {isRegister ? t.common.login : t.common.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
