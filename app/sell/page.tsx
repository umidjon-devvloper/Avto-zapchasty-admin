'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { api, errMessage, type CreateListingBody } from '@/lib/api';
import { auth } from '@/lib/auth';
import { resolveImage, cn } from '@/lib/utils';
import { getCoords } from '@/lib/geo';
import { useT, useLocalize, useLocalizePart } from '@/lib/i18n';
import type { Condition } from '@/lib/types';
import { RequireAuth } from '@/components/RequireAuth';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';

const CONDITION_KEYS: Condition[] = ['new', 'used', 'contract', 'original', 'duplicate'];

export default function SellPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <SellForm />
      </Suspense>
    </RequireAuth>
  );
}

function SellForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit') || '';
  const isEdit = !!editId;
  const toast = useToast();
  const t = useT();
  const lz = useLocalize();
  const lzp = useLocalizePart();
  const fileRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [partTypeId, setPartTypeId] = useState('');
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState<Condition>('used');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [oem, setOem] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [city, setCity] = useState('');
  const [delivery, setDelivery] = useState(false);
  const [phone, setPhone] = useState(auth.getUser()?.phone || '');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.categories });
  const { data: partTypes = [] } = useQuery({
    queryKey: ['part-types', categoryId],
    queryFn: () => api.categoryPartTypes(categoryId),
    enabled: !!categoryId,
  });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: () => api.brands() });
  const { data: models = [] } = useQuery({
    queryKey: ['models', brandId],
    queryFn: () => api.brandModels(brandId),
    enabled: !!brandId,
  });
  const { data: cities = [] } = useQuery({ queryKey: ['cities'], queryFn: api.cities });

  // Tahrirlash rejimi — mavjud e'lonni yuklab, formani to'ldirish
  const { data: editListing } = useQuery({
    queryKey: ['edit-listing', editId],
    queryFn: () => api.listing(editId),
    enabled: isEdit,
  });
  useEffect(() => {
    if (!editListing) return;
    const l = editListing;
    setPhotos(l.photos ?? []);
    setPartTypeId(typeof l.partTypeId === 'object' ? l.partTypeId?._id ?? '' : (l.partTypeId ?? ''));
    setCategoryId(typeof l.categoryId === 'object' ? l.categoryId?._id ?? '' : (l.categoryId ?? ''));
    setTitle(l.title ?? '');
    setCondition((l.condition as Condition) ?? 'used');
    setPrice(l.price?.amount != null ? String(l.price.amount) : '');
    setNegotiable(!!l.negotiable);
    setManufacturer(l.manufacturer ?? '');
    setOem((l.oemNumbers ?? []).join(', '));
    const b = l.fitment?.brandId;
    const m = l.fitment?.modelId;
    setBrandId(typeof b === 'object' ? b?._id ?? '' : (b ?? ''));
    setModelId(typeof m === 'object' ? m?._id ?? '' : (m ?? ''));
    setCity(l.city ?? '');
    setDelivery(!!l.delivery);
    if (l.phone) setPhone(l.phone);
    setDescription(l.description ?? '');
  }, [editListing]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 8) {
      toast.show(t.sell.maxPhotos, 'info');
      return;
    }
    setUploading(true);
    try {
      const urls = await api.uploadImages(files);
      setPhotos((p) => [...p, ...urls]);
    } catch (err) {
      toast.show(errMessage(err), 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const valid = partTypeId && title.trim().length >= 3 && Number(price) > 0;

  const submit = async () => {
    if (!valid) {
      toast.show(t.sell.requiredHint, 'info');
      return;
    }
    setBusy(true);
    try {
      const body: CreateListingBody = {
        partTypeId,
        title: title.trim(),
        description: description.trim(),
        oemNumbers: oem.split(',').map((s) => s.trim()).filter(Boolean),
        condition,
        manufacturer: manufacturer.trim(),
        price: { amount: Number(price), currency: 'UZS' },
        negotiable,
        fitment: { brandId: brandId || undefined, modelId: modelId || undefined },
        photos,
        city,
        delivery,
        phone: phone.trim(),
      };
      if (isEdit) {
        await api.updateListing(editId, body);
        toast.show(t.myListings.updated, 'success');
      } else {
        // Joylashuv (ruxsat berilgan bo'lsa) — "yaqin-atrofdagi e'lonlar" uchun
        const coords = await getCoords();
        if (coords) { body.lat = coords.lat; body.lng = coords.lng; }
        await api.createListing(body);
        toast.show(t.sell.posted, 'success');
      }
      router.push('/my-listings');
    } catch (err) {
      toast.show(errMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-ink">{isEdit ? t.myListings.editTitle : t.sell.title}</h1>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Rasmlar */}
        <Section title={t.sell.photos} hint={t.sell.photosHint}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-line">
                <Image src={resolveImage(url)} alt={`${i + 1}`} fill sizes="120px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-amber px-1.5 py-0.5 text-[10px] font-bold text-ink">
                    {t.sell.main}
                  </span>
                )}
                <button
                  onClick={() => setPhotos((p) => p.filter((u) => u !== url))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {photos.length < 8 && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-line2 text-muted hover:border-amber hover:text-amber-600"
              >
                {uploading ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
                <span className="text-xs">{uploading ? t.common.loading : t.sell.add}</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPick} />
        </Section>

        {/* Asosiy */}
        <Section title={t.sell.basicInfo}>
          <div className="space-y-4">
            <Select
              label={t.sell.categoryReq}
              placeholder={t.sell.select}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPartTypeId('');
              }}
              options={categories.map((c) => ({ value: c._id, label: lz(c.name) }))}
            />
            {categoryId && (
              <Select
                label={t.sell.partTypeReq}
                placeholder={t.sell.select}
                value={partTypeId}
                onChange={(e) => setPartTypeId(e.target.value)}
                options={partTypes.map((p) => ({ value: p._id, label: lzp(p) }))}
              />
            )}
            <Input label={t.sell.titleReq} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.sell.titlePlaceholder} />

            <div>
              <span className="mb-1.5 block text-sm font-medium text-muted">{t.sell.conditionReq}</span>
              <div className="flex flex-wrap gap-2">
                {CONDITION_KEYS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                      condition === c
                        ? 'border-navy bg-navy text-white'
                        : 'border-line bg-card text-ink hover:bg-surface'
                    )}
                  >
                    {t.conditions[c]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label={t.sell.priceReq}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350000"
              />
              <label className="flex cursor-pointer items-center gap-2.5 self-end pb-3">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="h-4 w-4 accent-amber"
                />
                <span className="text-sm text-ink">{t.sell.negotiable}</span>
              </label>
            </div>
          </div>
        </Section>

        {/* Qo'shimcha */}
        <Section title={t.sell.extra}>
          <div className="space-y-4">
            <Input label={t.sell.manufacturer} value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="Bosch, Advics..." />
            <Input label={t.sell.oem} value={oem} onChange={(e) => setOem(e.target.value)} placeholder="04465-33471, 0446533471" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label={t.sell.brand}
                placeholder={t.sell.select}
                value={brandId}
                onChange={(e) => {
                  setBrandId(e.target.value);
                  setModelId('');
                }}
                options={brands.map((b) => ({ value: b._id, label: b.name }))}
              />
              {brandId && (
                <Select
                  label={t.sell.model}
                  placeholder={t.sell.select}
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  options={models.map((m) => ({ value: m._id, label: m.name }))}
                />
              )}
            </div>

            <Textarea
              label={t.sell.descLabel}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.sell.descPlaceholder}
            />
          </div>
        </Section>

        {/* Aloqa */}
        <Section title={t.sell.contactSection}>
          <div className="space-y-4">
            <Select
              label={t.common.city}
              placeholder={t.sell.select}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={cities.map((c) => ({ value: lz(c.name), label: lz(c.name) }))}
            />
            <Input label={t.sell.phone} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998..." />
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} className="h-4 w-4 accent-amber" />
              <span className="text-sm text-ink">{t.sell.deliveryAvailable}</span>
            </label>
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <Button size="lg" onClick={submit} loading={busy} disabled={!valid}>
            {isEdit ? t.myListings.saveEdit : t.sell.submit}
          </Button>
          {!valid && <span className="text-sm text-muted">{t.sell.fillRequired}</span>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-sm text-muted">{hint}</p>}
      <div className={hint ? '' : 'mt-4'}>{children}</div>
    </section>
  );
}
