'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Send } from 'lucide-react';
import { api, errMessage } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { RequireAuth } from '@/components/RequireAuth';
import { PageLoader } from '@/components/ui/Misc';
import { useToast } from '@/components/Toast';

export default function ConversationPage() {
  return (
    <RequireAuth>
      <Conversation />
    </RequireAuth>
  );
}

function Conversation() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const t = useT();
  const me = auth.getUser();
  const myId = me?.id || me?._id;
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => api.messages(id),
    enabled: !!id,
    refetchInterval: 5_000,
  });

  // Ochilganda o'qilgan deb belgilash + suhbatlar ro'yxatini yangilash
  useEffect(() => {
    if (id) api.markRead(id).then(() => qc.invalidateQueries({ queryKey: ['conversations'] })).catch(() => {});
  }, [id, qc]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setSending(true);
    setText('');
    try {
      await api.sendMessage(id, t);
      qc.invalidateQueries({ queryKey: ['messages', id] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    } catch (err) {
      toast.show(errMessage(err), 'error');
      setText(t);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-page py-6">
      <div className="mx-auto flex h-[calc(100vh-180px)] max-w-2xl flex-col overflow-hidden rounded-lg border border-line bg-card">
        {/* Sarlavha */}
        <div className="flex items-center gap-2 border-b border-line p-3">
          <button onClick={() => router.push('/messages')} className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-surface">
            <ChevronLeft size={20} />
          </button>
          <p className="font-bold text-ink">{t.messages.conversation}</p>
        </div>

        {/* Xabarlar */}
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {isLoading ? (
            <PageLoader />
          ) : messages && messages.length > 0 ? (
            messages.map((m) => {
              const mine = m.senderId === myId;
              return (
                <div key={m._id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-3.5 py-2 text-[15px]',
                      mine ? 'rounded-br-sm bg-navy text-white' : 'rounded-bl-sm bg-surface text-ink'
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-10 text-center text-sm text-muted">{t.messages.noMessages}</p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Yuborish */}
        <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.messages.typePlaceholder}
            className="h-11 flex-1 rounded-full border border-line bg-bg px-4 text-[15px] focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
