import type { Metadata } from 'next';

import { BlogIndexPage } from '@/components/blog-pages';
import { BLOG_COPY } from '@/lib/blog';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${BLOG_COPY.en.label} - ${SITE_NAME}`,
  description: BLOG_COPY.en.indexLead,
  alternates: {
    canonical: new URL('/en/blog', SITE_ORIGIN),
    languages: {
      'pl-PL': new URL('/pl/blog', SITE_ORIGIN),
      en: new URL('/en/blog', SITE_ORIGIN),
      'x-default': new URL('/pl/blog', SITE_ORIGIN),
    },
  },
};

export default function EnglishBlogIndex() {
  return <BlogIndexPage language="en" />;
}
