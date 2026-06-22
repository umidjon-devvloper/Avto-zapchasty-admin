'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User as UserIcon, Package, Heart, MessageCircle, LogOut, Store } from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { auth, useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { formatPhone } from '@/lib/utils';
import { RequireAuth } from '@/components/RequireAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const t = useT();
  const { user } = useAuth();

  const { data: me } = useQuery({ queryKey: ['me'], queryFn: api.me });
  const current = me || user;

  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (current) {
      setName(current.name || '');
      setShopName(current.sellerProfile?.shopName || '');
      setCity(current.sellerProfile?.city || '');
    }
  }, [current]);

  const save = useMutation({
    mutationFn: () => api.updateProfile({ name, shopName, city }),
    onSuccess: (u) => {
      auth.setUser(u);
      qc.invalidateQueries({ queryKey: ['me'] });
      toast.show(t.profile.saved, 'success');
    },
    onError: (e) => toast.show(errMessage(e), 'error'),
  });

  const logout = async () => {
    const rt = auth.getRefresh();
    if (rt) api.logout(rt).catch(() => {});
    auth.clear();
    router.push('/');
  };

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-ink">{t.profile.title}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Tahrirlash formasi */}
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <UserIcon size={30} />
            </span>
            <div>
              <p className="text-lg font-bold text-ink">{current?.name || t.profile.userFallback}</p>
              <p className="text-sm text-muted">{formatPhone(current?.phone)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input label={t.profile.name} value={name} onChange={(e) => setName(e.target.value)} placeholder={t.profile.namePlaceholder} />
            <Input
              label={t.profile.shopName}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={t.profile.shopPlaceholder}
            />
            <Input label={t.common.city} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Toshkent" />

            <Button onClick={() => save.mutate()} loading={save.isPending}>
              {t.common.save}
            </Button>
          </div>
        </div>

        {/* Yon panel */}
        <aside className="space-y-3">
          <NavCard href="/my-listings" icon={<Package size={20} />} label={t.common.myListings} />
          <NavCard href="/favorites" icon={<Heart size={20} />} label={t.common.favorites} />
          <NavCard href="/messages" icon={<MessageCircle size={20} />} label={t.common.messages} />
          <NavCard href="/sell" icon={<Store size={20} />} label={t.common.sell} />
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg border border-line bg-card p-4 text-left font-semibold text-danger hover:bg-danger/5"
          >
            <LogOut size={20} /> {t.common.logout}
          </button>
        </aside>
      </div>
    </div>
  );
}

function NavCard({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-line bg-card p-4 font-semibold text-ink transition-colors hover:border-amber/40 hover:bg-amber-50/40"
    >
      <span className="text-amber-600">{icon}</span>
      {label}
    </Link>
  );
}
