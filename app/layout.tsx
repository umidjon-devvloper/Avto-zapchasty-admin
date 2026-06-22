import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query-provider';
import { ToastProvider } from '@/components/Toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zapchasty.uz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Zapchasty — Avto ehtiyot qismlar bozori',
    template: '%s — Zapchasty',
  },
  description:
    "O'zbekistondagi avto ehtiyot qismlar onlayn bozori. OEM raqam, brend va model bo'yicha tez toping. Ishonchli sotuvchilar.",
  keywords: [
    'avto ehtiyot qismlar',
    'zapchast',
    'Zapchasty',
    'OEM',
    "O'zbekiston",
    'avtomobil',
  ],
  icons: {
    icon: [
      { url: '/harf-logo-favicon-32px.png', sizes: '32x32', type: 'image/png' },
      { url: '/harf-logo-favicon-64px.png', sizes: '64x64', type: 'image/png' },
      { url: '/harf-logo-header-large-96px.png', sizes: '96x96', type: 'image/png' },
      { url: '/harf-logo-header-xl-128px.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: [
      { url: '/harf-logo-header-xl-128px.png', sizes: '128x128', type: 'image/png' },
      { url: '/harf-logo-social-512px.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/harf-logo-favicon-32px.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: siteUrl,
    siteName: 'Zapchasty',
    title: 'Zapchasty — Avto ehtiyot qismlar bozori',
    description:
      "O'zbekistondagi avto ehtiyot qismlar onlayn bozori. OEM raqam, brend va model bo'yicha tez toping.",
    images: [
      {
        url: '/harf-logo-social-512px.png',
        width: 512,
        height: 512,
        alt: 'Zapchasty logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Zapchasty — Avto ehtiyot qismlar bozori',
    description: "O'zbekistondagi avto ehtiyot qismlar onlayn bozori.",
    images: ['/harf-logo-social-512px.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body>
        <QueryProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}