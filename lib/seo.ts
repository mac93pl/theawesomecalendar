import type { Metadata } from 'next';

import type { SiteLanguage } from '@/lib/calendar';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const SEO_COPY = {
  pl: {
    title: 'Darmowy kalendarz liniowy do druku | The Awesome Calendar',
    description:
      'Wygeneruj i pobierz darmowy kalendarz liniowy PDF. Wydrukuj go na zwykłych kartkach A4, wytnij paski i sklej cały rok w jedną czytelną oś czasu.',
    imageAlt: 'The Awesome Calendar — darmowy kalendarz liniowy do druku',
    locale: 'pl_PL',
    path: '/',
  },
  en: {
    title: 'Free printable linear calendar | The Awesome Calendar',
    description:
      'Generate and download a free linear calendar PDF. Print it on regular A4 paper, cut out the strips and join the whole year into one clear timeline.',
    imageAlt: 'The Awesome Calendar — free printable linear calendar',
    locale: 'en_US',
    path: '/en',
  },
} as const;

function verification(): Metadata['verification'] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();

  if (!google && !bing) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
  };
}

export function createSiteMetadata(language: SiteLanguage): Metadata {
  const copy = SEO_COPY[language];
  const url = new URL(copy.path, SITE_ORIGIN);

  return {
    metadataBase: new URL(SITE_ORIGIN),
    applicationName: SITE_NAME,
    manifest: '/site.webmanifest',
    title: copy.title,
    description: copy.description,
    authors: [{ name: 'Maciej Dorotniak' }],
    creator: 'Maciej Dorotniak',
    publisher: SITE_NAME,
    alternates: {
      canonical: url,
      languages: {
        'pl-PL': new URL('/', SITE_ORIGIN),
        en: new URL('/en', SITE_ORIGIN),
        'x-default': new URL('/', SITE_ORIGIN),
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      locale: copy.locale,
      alternateLocale: language === 'pl' ? ['en_US'] : ['pl_PL'],
      title: copy.title,
      description: copy.description,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: copy.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: ['/og.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification: verification(),
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        {
          url: '/favicon.ico',
          type: 'image/x-icon',
          sizes: '16x16 32x32 48x48',
        },
      ],
      apple: [
        {
          url: '/apple-touch-icon.png',
          type: 'image/png',
          sizes: '180x180',
        },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#0b0b0a',
        },
      ],
    },
    other: {
      'theme-color': '#ffc914',
      'msapplication-TileColor': '#ffc914',
    },
  };
}
