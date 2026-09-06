import type { SiteLanguage } from '@/lib/calendar';
import { SITE_NAME, SITE_ORIGIN, localizedSiteUrl } from '@/lib/site';

const SCHEMA_COPY = {
  pl: {
    description:
      'Darmowy generator kalendarza liniowego PDF do wydruku na kartkach A4 i sklejenia w jedną oś czasu.',
    features: [
      'Dowolny zakres dat',
      'Dwa style kalendarza',
      'Niezależna szerokość i wysokość dnia',
      'Eksport do PDF A4',
      'Język polski i angielski',
    ],
  },
  en: {
    description:
      'A free printable PDF linear calendar generator for A4 paper that joins into one continuous timeline.',
    features: [
      'Any date range',
      'Two calendar styles',
      'Independent day width and height',
      'A4 PDF export',
      'Polish and English',
    ],
  },
} as const;

export function SeoStructuredData({ language }: { language: SiteLanguage }) {
  const copy = SCHEMA_COPY[language];
  const pageUrl = localizedSiteUrl(language);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: SITE_NAME,
        inLanguage: ['pl', 'en'],
      },
      {
        '@type': ['SoftwareApplication', 'WebApplication'],
        '@id': `${SITE_ORIGIN}/#application`,
        name: SITE_NAME,
        url: pageUrl,
        image: `${SITE_ORIGIN}/og.png`,
        description: copy.description,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Any',
        browserRequirements:
          'Requires a modern web browser with JavaScript enabled.',
        inLanguage: language,
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: 'Maciej Dorotniak',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: language === 'pl' ? 'PLN' : 'USD',
        },
        featureList: copy.features,
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
      type="application/ld+json"
    />
  );
}
