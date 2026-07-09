'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useT } from '@/lib/i18n';

export function Footer() {
  const t = useT();

  return (
    <footer className="mt-16 border-t border-line bg-surface/60">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Zapchasty">
              <Image
                src="/harf-logo.png"
                alt="Zapchasty"
                width={44}
                height={44}
                className="h-10 w-10 object-contain mix-blend-multiply"
              />
              <span className="text-xl font-extrabold tracking-tight text-navy-800">
                Zapchast<span className="text-amber">y</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>

          <FooterCol
            title={t.footer.forBuyers}
            links={[
              { label: t.footer.searchLink, href: '/search' },
              { label: t.footer.categories, href: '/#categories' },
              { label: t.common.favorites, href: '/favorites' },
            ]}
          />
          <FooterCol
            title={t.footer.forSellers}
            links={[
              { label: t.common.sell, href: '/sell' },
              { label: t.common.myListings, href: '/my-listings' },
              { label: t.common.profile, href: '/profile' },
            ]}
          />
          <FooterCol
            title={t.footer.info}
            links={[
              { label: t.footer.about, href: '/' },
              { label: t.footer.help, href: '/' },
              { label: t.footer.privacy, href: '/' },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-line pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.footer.getApp}</p>
          <div className="flex items-center gap-3">
            <div className="group relative opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <Image
                src="/download-on-the-app-store-apple-logo-svgrepo-com.svg"
                alt="App Store"
                width={127}
                height={40}
                className="h-10 w-auto"
              />
              <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-full bg-navy-800 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow-card transition-opacity group-hover:opacity-100">
                {t.footer.comingSoon}
              </span>
            </div>
            <div className="group relative opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              <Image
                src="/google-play-badge.png"
                alt="Google Play"
                width={133}
                height={40}
                className="h-10 w-auto"
              />
              <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap rounded-full bg-navy-800 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow-card transition-opacity group-hover:opacity-100">
                {t.footer.comingSoon}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Zapchasty. {t.footer.rights}</p>
          <p>{t.footer.country}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-ink">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-muted hover:text-amber-600">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
