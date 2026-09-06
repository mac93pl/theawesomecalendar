import type { MetadataRoute } from 'next';

import { BLOG_ARTICLES, blogPath, getTranslatedArticle } from '@/lib/blog';
import { SITE_ORIGIN } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_ORIGIN}/pl`,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          'pl-PL': `${SITE_ORIGIN}/pl`,
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
          'pl-PL': `${SITE_ORIGIN}/pl`,
          en: `${SITE_ORIGIN}/en`,
          'x-default': `${SITE_ORIGIN}/`,
        },
      },
    },
    {
      url: `${SITE_ORIGIN}/pl/blog`,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'pl-PL': `${SITE_ORIGIN}/pl/blog`,
          en: `${SITE_ORIGIN}/en/blog`,
          'x-default': `${SITE_ORIGIN}/pl/blog`,
        },
      },
    },
    {
      url: `${SITE_ORIGIN}/en/blog`,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'pl-PL': `${SITE_ORIGIN}/pl/blog`,
          en: `${SITE_ORIGIN}/en/blog`,
          'x-default': `${SITE_ORIGIN}/pl/blog`,
        },
      },
    },
  ];

  const articlePages: MetadataRoute.Sitemap = BLOG_ARTICLES.pl.flatMap(
    (article) => {
      const translatedArticle = getTranslatedArticle('en', article.id);
      if (!translatedArticle) return [];

      const languages = {
        'pl-PL': `${SITE_ORIGIN}${blogPath('pl', article.slug)}`,
        en: `${SITE_ORIGIN}${blogPath('en', translatedArticle.slug)}`,
        'x-default': `${SITE_ORIGIN}${blogPath('pl', article.slug)}`,
      };

      return [
        {
          url: languages['pl-PL'],
          lastModified: article.date,
          changeFrequency: 'yearly' as const,
          priority: 0.7,
          alternates: { languages },
        },
        {
          url: languages.en,
          lastModified: translatedArticle.date,
          changeFrequency: 'yearly' as const,
          priority: 0.7,
          alternates: { languages },
        },
      ];
    },
  );

  return [...sitePages, ...articlePages];
}
