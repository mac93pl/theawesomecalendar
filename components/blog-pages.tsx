import { ArrowLeft, ArrowRight } from 'lucide-react';

import { BlogDownloadCta } from '@/components/blog-download-cta';
import { BlogFooter } from '@/components/blog-footer';
import { BlogHeader } from '@/components/blog-header';
import { BlogTopics } from '@/components/blog-topics';
import type { SiteLanguage } from '@/lib/calendar';
import {
  BLOG_ARTICLES,
  BLOG_COPY,
  type BlogArticle,
  blogPath,
  getTranslatedArticle,
} from '@/lib/blog';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';

function formatArticleDate(date: string, language: SiteLanguage) {
  return new Intl.DateTimeFormat(language === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function ArticleTags({
  article,
  language,
}: {
  article: BlogArticle;
  language: SiteLanguage;
}) {
  return (
    <section aria-labelledby="article-tags-title" className="blog-article-tags">
      <h2 id="article-tags-title">{BLOG_COPY[language].keywords}</h2>
      <ul>
        {article.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </section>
  );
}

export function BlogIndexPage({ language }: { language: SiteLanguage }) {
  const copy = BLOG_COPY[language];
  const alternateLanguage = language === 'pl' ? 'en' : 'pl';

  return (
    <>
      <BlogHeader
        alternatePath={blogPath(alternateLanguage)}
        language={language}
      />
      <main className="blog-main" id="top">
        <header className="blog-index-hero">
          <p className="section-kicker">{copy.label}</p>
          <h1>{copy.indexTitle}</h1>
          <p>{copy.indexLead}</p>
        </header>
        <div className="blog-layout blog-index-layout">
          <BlogTopics language={language} />
          <section aria-label={copy.allArticles} className="blog-card-list">
            {BLOG_ARTICLES[language].map((article) => (
              <article className="blog-card" key={article.id}>
                <div className="blog-card-meta">
                  <time dateTime={article.date}>
                    {formatArticleDate(article.date, language)}
                  </time>
                </div>
                <h2>
                  <a href={blogPath(language, article.slug)}>{article.title}</a>
                </h2>
                <p>{article.lead}</p>
                <div className="blog-card-footer">
                  <ul aria-label={copy.keywords}>
                    {article.tags.slice(0, 3).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a
                    className="blog-card-link"
                    href={blogPath(language, article.slug)}
                  >
                    {copy.readArticle}
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <BlogFooter language={language} />
    </>
  );
}

export function BlogArticlePage({
  article,
  language,
}: {
  article: BlogArticle;
  language: SiteLanguage;
}) {
  const copy = BLOG_COPY[language];
  const alternateLanguage = language === 'pl' ? 'en' : 'pl';
  const translatedArticle = getTranslatedArticle(alternateLanguage, article.id);
  const articleUrl = `${SITE_ORIGIN}${blogPath(language, article.slug)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: language === 'pl' ? 'pl-PL' : 'en',
    keywords: article.tags.join(', '),
    mainEntityOfPage: articleUrl,
    author: { '@type': 'Person', name: 'Maciej Dorotniak' },
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <>
      <BlogHeader
        alternatePath={
          translatedArticle
            ? blogPath(alternateLanguage, translatedArticle.slug)
            : blogPath(alternateLanguage)
        }
        language={language}
      />
      <main className="blog-main" id="top">
        <div className="blog-layout blog-article-layout">
          <BlogTopics activeId={article.id} language={language} />
          <article className="blog-article">
            <a className="blog-back-link" href={blogPath(language)}>
              <ArrowLeft aria-hidden="true" />
              {copy.backToBlog}
            </a>
            <header className="blog-article-header">
              <p className="section-kicker">{copy.label}</p>
              <h1>{article.title}</h1>
              <p className="blog-article-lead">{article.lead}</p>
              <p className="blog-article-date">
                {copy.published}{' '}
                <time dateTime={article.date}>
                  {formatArticleDate(article.date, language)}
                </time>
              </p>
            </header>
            <div className="blog-article-body">
              {article.sections.map((section, sectionIndex) => (
                <div className="blog-article-section" key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {sectionIndex === 1 ? (
                    <BlogDownloadCta language={language} />
                  ) : null}
                </div>
              ))}
            </div>
            <ArticleTags article={article} language={language} />
          </article>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
          type="application/ld+json"
        />
      </main>
      <BlogFooter language={language} />
    </>
  );
}
