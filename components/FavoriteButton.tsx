'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { useToast } from './Toast';
import { cn } from '@/lib/utils';

export function FavoriteButton({
  id,
  initial = false,
  size = 18,
  className,
}: {
  id: string;
  initial?: boolean;
  size?: number;
  className?: string;
}) {
  const [fav, setFav] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const t = useT();

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.isAuthed()) {
      toast.show(t.favButton.loginToFav, 'info');
      router.push('/login');
      return;
    }
    setBusy(true);
    const next = !fav;
    setFav(next); // optimistik
    try {
      const result = await api.toggleFavorite(id);
      setFav(result);
    } catch (e) {
      setFav(!next);
      toast.show(errMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={fav ? t.favButton.remove : t.favButton.add}
      className={cn(
        'flex items-center justify-center rounded-full bg-card/90 backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-card active:scale-90',
        className
      )}
    >
      <Heart
        key={fav ? 'on' : 'off'}
        size={size}
        className={cn(
          'transition-colors',
          fav ? 'animate-pop fill-danger text-danger' : 'text-muted'
        )}
      />
    </button>
  );
}
