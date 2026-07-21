'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User as UserIcon, Package, Heart, MessageCircle, LogOut, Store, Camera, Trash2, Loader2 } from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { auth, useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { formatPhone, resolveImage } from '@/lib/utils';
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
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (current) {
      setName(current.name || '');
      setShopName(current.sellerProfile?.shopName || '');
      setCity(current.sellerProfile?.city || '');
      setAvatar(current.sellerProfile?.avatar || '');
    }
  }, [current]);

  // Rasm tanlanganda: 30MB tekshiruv -> yuklash -> darhol profilga saqlash
  const onPickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      toast.show(t.profile.photoTooBig, 'error');
      return;
    }
    setUploading(true);
    try {
      const [url] = await api.uploadImages([file]);
      const u = await api.updateProfile({ avatar: url });
      auth.setUser(u);
      setAvatar(url);
      qc.invalidateQueries({ queryKey: ['me'] });
      toast.show(t.profile.photoSaved, 'success');
    } catch (err) {
      toast.show(errMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  const onRemovePhoto = async () => {
    setUploading(true);
    try {
      const u = await api.updateProfile({ avatar: '' });
      auth.setUser(u);
      setAvatar('');
      qc.invalidateQueries({ queryKey: ['me'] });
      toast.show(t.profile.saved, 'success');
    } catch (err) {
      toast.show(errMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

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
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line bg-amber-50 text-amber-700"
              title={t.profile.photoUpload}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveImage(avatar)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <UserIcon size={34} />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {uploading ? (
                  <Loader2 size={22} className="animate-spin text-white" />
                ) : (
                  <Camera size={22} className="text-white" />
                )}
              </span>
            </button>
            <div className="min-w-0">
              <p className="text-lg font-bold text-ink">{current?.name || t.profile.userFallback}</p>
              <p className="text-sm text-muted">{formatPhone(current?.phone)}</p>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50"
                >
                  <Camera size={15} /> {t.profile.photoUpload}
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={onRemovePhoto}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger hover:underline disabled:opacity-50"
                  >
                    <Trash2 size={15} /> {t.profile.photoRemove}
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted">{t.profile.photoHint}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
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
