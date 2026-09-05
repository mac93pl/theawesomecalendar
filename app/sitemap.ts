import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          'pl-PL': `${SITE_ORIGIN}/`,
          en: `${SITE_ORIGIN}/en`,
          'x-default': `${SITE_ORIGIN}/`,
        },
      },
    },
    {
      url: `${SITE_ORIGIN}/en`,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          'pl-PL': `${SITE_ORIGIN}/`,
          en: `${SITE_ORIGIN}/en`,
          'x-default': `${SITE_ORIGIN}/`,
        },
      },
    },
  ];
}
