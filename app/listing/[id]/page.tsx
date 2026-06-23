import type { Metadata } from 'next';
import { ListingClient } from './ListingClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zapchasty.uz';
const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:4000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
const OG_FALLBACK = 'https://7harivf5tf.ufs.sh/f/z3vBnfCC3XgsdIdVUBXRULnVCO8oXaA6qsfzwbScd3kKpuYe';

function resolveOgImage(u?: string): string {
  if (!u) return OG_FALLBACK;
  return u.startsWith('http') ? u : API_ORIGIN + u;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/listings/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('not found');
    const { listing } = await res.json();

    const title: string = listing.title ?? "E'lon";
    const price: string = listing.price?.amount
      ? `${new Intl.NumberFormat('ru-RU').format(listing.price.amount)} ${listing.price.currency === 'USD' ? '$' : "so'm"}`
      : '';
    const description: string = listing.description
      ? listing.description.slice(0, 155)
      : [title, price, listing.city].filter(Boolean).join(' · ');

    const ogImage = resolveOgImage(listing.photos?.[0]);
    const pageUrl = `${SITE_URL}/listing/${id}`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} — Zapchasty`,
        description,
        url: pageUrl,
        siteName: 'Zapchasty',
        locale: 'uz_UZ',
        type: 'website',
        images: [{ url: ogImage, width: 800, height: 600, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} — Zapchasty`,
        description,
        images: [ogImage],
      },
      alternates: { canonical: pageUrl },
    };
  } catch {
    return { title: "E'lon topilmadi — Zapchasty" };
  }
}

export default async function ListingPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <ListingClient id={id} />;
}
