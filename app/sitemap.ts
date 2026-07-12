import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zapchasty.uz';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// Sitemap har soatda yangilanadi
export const revalidate = 3600;

const PAGE_LIMIT = 50; // backend /search max 50 taga ruxsat beradi
const MAX_PAGES = 20; // sitemapga eng yangi 1000 ta e'lon kiradi

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${SITE_URL}/support`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Kategoriyalar
  const catData = await fetchJson<{ categories: { _id: string }[] }>(
    `${API_URL}/catalog/categories`
  );
  const categoryPages: MetadataRoute.Sitemap = (catData?.categories ?? []).map((c) => ({
    url: `${SITE_URL}/category/${c._id}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Aktiv e'lonlar (eng yangilari birinchi, sahifalab)
  const listingPages: MetadataRoute.Sitemap = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await fetchJson<{ items: { _id: string; updatedAt?: string }[] }>(
      `${API_URL}/search?sort=newest&limit=${PAGE_LIMIT}&page=${page}`
    );
    const items = data?.items ?? [];
    for (const item of items) {
      listingPages.push({
        url: `${SITE_URL}/listing/${item._id}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
        changeFrequency: 'daily',
        priority: 0.6,
      });
    }
    if (items.length < PAGE_LIMIT) break;
  }

  return [...staticPages, ...categoryPages, ...listingPages];
}
