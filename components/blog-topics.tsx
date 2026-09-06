'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BLOG_ARTICLES,
  BLOG_COPY,
  type BlogArticle,
  blogPath,
} from '@/lib/blog';
import type { SiteLanguage } from '@/lib/calendar';

function formatArticleDate(date: string, language: SiteLanguage) {
  return new Intl.DateTimeFormat(language === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function TopicList({
  activeId,
  articles,
  language,
}: {
  activeId?: string;
  articles: BlogArticle[];
  language: SiteLanguage;
}) {
  return (
    <ol>
      {articles.map((article) => (
        <li key={article.id}>
          <a
            aria-current={activeId === article.id ? 'page' : undefined}
            href={blogPath(language, article.slug)}
          >
            <time className="blog-topic-date" dateTime={article.date}>
              {formatArticleDate(article.date, language)}
            </time>
            <span className="blog-topic-title">{article.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function BlogTopics({
  activeId,
  language,
}: {
  activeId?: string;
  language: SiteLanguage;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const articles = BLOG_ARTICLES[language];
  const copy = BLOG_COPY[language];

  return (
    <aside aria-label={copy.topics} className="blog-topics">
      <Collapsible
        className="blog-topics-collapsible"
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <div className="blog-topics-heading">
          <p className="blog-topics-desktop-heading">{copy.topics}</p>
          <CollapsibleTrigger className="blog-topics-trigger">
            <span>{copy.topics}</span>
            <span className="blog-topics-trigger-action">
              {isOpen ? copy.collapseTopics : copy.expandTopics}
              <ChevronDown aria-hidden="true" />
            </span>
          </CollapsibleTrigger>
        </div>

        <ScrollArea className="blog-topics-desktop-list">
          <TopicList
            activeId={activeId}
            articles={articles}
            language={language}
          />
        </ScrollArea>

        {!isOpen ? (
          <div className="blog-topics-mobile-peek">
            <TopicList
              activeId={activeId}
              articles={articles.slice(0, 2)}
              language={language}
            />
          </div>
        ) : null}

        <CollapsibleContent className="blog-topics-mobile-panel">
          <ScrollArea className="blog-topics-mobile-scroll">
            <TopicList
              activeId={activeId}
              articles={articles}
              language={language}
            />
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}
