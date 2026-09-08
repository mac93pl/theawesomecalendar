import type { SiteLanguage } from '@/lib/calendar';
import { SITE_NAME, SITE_ORIGIN, localizedSiteUrl } from '@/lib/site';

const SCHEMA_COPY = {
  pl: {
    description:
      'The Awesome Calendar to darmowy kalendarz liniowy do druku. Pokazuje kolejne dni na jednej osi czasu, dzięki czemu łatwiej porównać terminy i zobaczyć długość projektów. Wybierz gotowy kalendarz roczny lub własny zakres dat i pobierz PDF A4 bez zakładania konta. Wydrukuj kartki, wytnij paski i sklej je w ciągłą oś czasu. Dostępne są wersje polska i angielska.',
    features: [
      'Gotowe kalendarze roczne',
      'Dowolny zakres dat',
      'Dwa style kalendarza',
      'Niezależna szerokość i wysokość dnia',
      'Eksport do PDF A4',
      'Bezpłatne pobieranie PDF bez zakładania konta',
      'Język polski i angielski',
    ],
  },
  en: {
    description:
      'The Awesome Calendar is a free printable linear calendar. It places consecutive days on one continuous timeline so you can compare deadlines and see project durations together. Choose a ready-made yearly calendar or your own date range and download an A4 PDF without creating an account. Print the sheets, cut out the strips and join them into one continuous timeline. Polish and English versions are available.',
    features: [
      'Ready-made yearly calendars',
      'Any date range',
      'Two calendar styles',
      'Independent day width and height',
      'A4 PDF export',
      'Free PDF downloads without creating an account',
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
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: SITE_NAME,
        inLanguage: language,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        mainEntity: { '@id': `${SITE_ORIGIN}/#application` },
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
        inLanguage: ['pl', 'en'],
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
