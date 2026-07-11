import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zapchasty.uz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/register',
          '/profile',
          '/favorites',
          '/messages',
          '/my-listings',
          '/sell',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
