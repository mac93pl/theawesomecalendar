'use client';

import { Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/brand-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SiteLanguage } from '@/lib/calendar';
import { COPY } from '@/lib/translations';

type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'awesome-calendar-theme';

export function BlogHeader({
  alternatePath,
  language,
}: {
  alternatePath: string;
  language: SiteLanguage;
}) {
  const copy = COPY[language];
  const [theme, setTheme] = useState<Theme>('light');
  const homePath = `/${language}`;
  const blogPath = `/${language}/blog`;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTheme(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      );
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme: Theme = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme;
    window.sessionStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const selectLanguage = (nextLanguage: SiteLanguage) => {
    window.localStorage.setItem('awesome-calendar-language', nextLanguage);
    document.cookie = `awesome-calendar-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    if (nextLanguage !== language) window.location.assign(alternatePath);
  };

  return (
    <header className="site-header blog-site-header">
      <a aria-label={copy.homeLabel} className="brand" href={homePath}>
        <BrandLogo alt="" priority />
      </a>
      <div className="header-actions">
        <nav aria-label={copy.navLabel} className="desktop-nav">
          <a href={`${homePath}#gotowy`}>{copy.nav.ready}</a>
          <a href={`${homePath}#generator`}>{copy.nav.custom}</a>
          <a aria-current="page" className="nav-blog" href={blogPath}>
            {copy.nav.blog}
          </a>
          <a className="nav-support" href={`${homePath}#wsparcie`}>
            {copy.nav.support}
          </a>
        </nav>
        <a
          className="mobile-nav-support nav-support"
          href={`${homePath}#wsparcie`}
        >
          {copy.nav.support}
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                aria-label={copy.nav.menu}
                className="mobile-nav-trigger"
                type="button"
              />
            }
          >
            <Menu aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="mobile-nav-menu"
            sideOffset={8}
          >
            <DropdownMenuItem
              render={
                <a aria-label={copy.nav.ready} href={`${homePath}#gotowy`} />
              }
            >
              {copy.nav.ready}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <a
                  aria-label={copy.nav.custom}
                  href={`${homePath}#generator`}
                />
              }
            >
              {copy.nav.custom}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<a aria-label={copy.nav.blog} href={blogPath} />}
            >
              {copy.nav.blog}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
              {theme === 'dark' ? copy.theme.light : copy.theme.dark}
            </DropdownMenuItem>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{copy.languageLabel}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                aria-label={copy.languageLabel}
                onValueChange={(value) => selectLanguage(value as SiteLanguage)}
                value={language}
              >
                <DropdownMenuRadioItem value="pl">PL</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          aria-label={theme === 'dark' ? copy.theme.light : copy.theme.dark}
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? copy.theme.light : copy.theme.dark}
          type="button"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden="true" />
          ) : (
            <Moon aria-hidden="true" />
          )}
        </button>
        <fieldset className="language-switch">
          <legend className="language-legend">{copy.languageLabel}</legend>
          <button
            aria-pressed={language === 'pl'}
            onClick={() => selectLanguage('pl')}
            type="button"
          >
            PL
          </button>
          <span aria-hidden="true">/</span>
          <button
            aria-pressed={language === 'en'}
            onClick={() => selectLanguage('en')}
            type="button"
          >
            EN
          </button>
        </fieldset>
      </div>
    </header>
  );
}
