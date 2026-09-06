import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogArticlePage } from '@/components/blog-pages';
import {
  BLOG_ARTICLES,
  blogPath,
  getBlogArticle,
  getTranslatedArticle,
} from '@/lib/blog';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_ARTICLES.en.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle('en', slug);
  if (!article) return {};
  const translatedArticle = getTranslatedArticle('pl', article.id);

  return {
    title: `${article.title} - ${SITE_NAME}`,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: new URL(blogPath('en', article.slug), SITE_ORIGIN),
      languages: {
        ...(translatedArticle
          ? {
              'pl-PL': new URL(
                blogPath('pl', translatedArticle.slug),
                SITE_ORIGIN,
              ),
            }
          : {}),
        en: new URL(blogPath('en', article.slug), SITE_ORIGIN),
        'x-default': new URL(
          translatedArticle
            ? blogPath('pl', translatedArticle.slug)
            : blogPath('en', article.slug),
          SITE_ORIGIN,
        ),
      },
    },
  };
}

export default async function EnglishBlogArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle('en', slug);
  if (!article) notFound();

  return <BlogArticlePage article={article} language="en" />;
}
