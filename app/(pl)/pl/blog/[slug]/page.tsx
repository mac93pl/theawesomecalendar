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
  return BLOG_ARTICLES.pl.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle('pl', slug);
  if (!article) return {};
  const translatedArticle = getTranslatedArticle('en', article.id);

  return {
    title: `${article.title} - ${SITE_NAME}`,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: new URL(blogPath('pl', article.slug), SITE_ORIGIN),
      languages: {
        'pl-PL': new URL(blogPath('pl', article.slug), SITE_ORIGIN),
        ...(translatedArticle
          ? {
              en: new URL(blogPath('en', translatedArticle.slug), SITE_ORIGIN),
            }
          : {}),
        'x-default': new URL(blogPath('pl', article.slug), SITE_ORIGIN),
      },
    },
  };
}

export default async function PolishBlogArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle('pl', slug);
  if (!article) notFound();

  return <BlogArticlePage article={article} language="pl" />;
}
