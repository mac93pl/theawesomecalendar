'use client';

import { ChevronRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/brand-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <DropdownMenu
          onOpenChange={setMobileMenuOpen}
          open={mobileMenuOpen}
        >
          <DropdownMenuTrigger
            render={
              <button
                aria-expanded={mobileMenuOpen}
                aria-label={
                  mobileMenuOpen ? copy.nav.closeMenu : copy.nav.menu
                }
                className="mobile-nav-trigger"
                type="button"
              />
            }
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </DropdownMenuTrigger>
          {mobileMenuOpen && (
            <DropdownMenuPortal>
              <button
                aria-label={copy.nav.closeMenu}
                className="mobile-nav-backdrop"
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={-1}
                type="button"
              />
            </DropdownMenuPortal>
          )}
          <DropdownMenuContent
            align="end"
            className="mobile-nav-menu"
            sideOffset={10}
          >
            <DropdownMenuGroup className="mobile-nav-primary">
              <DropdownMenuLabel className="mobile-nav-title">
                Menu
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="mobile-nav-primary-item"
                render={
                  <a aria-label={copy.nav.ready} href={`${homePath}#gotowy`} />
                }
              >
                <span className="mobile-nav-number">01</span>
                <span>{copy.nav.ready}</span>
                <ChevronRight aria-hidden="true" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="mobile-nav-primary-item"
                render={
                  <a
                    aria-label={copy.nav.custom}
                    href={`${homePath}#generator`}
                  />
                }
              >
                <span className="mobile-nav-number">02</span>
                <span>{copy.nav.custom}</span>
                <ChevronRight aria-hidden="true" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="mobile-nav-primary-item"
                render={<a aria-label={copy.nav.blog} href={blogPath} />}
              >
                <span className="mobile-nav-number">03</span>
                <span>{copy.nav.blog}</span>
                <ChevronRight aria-hidden="true" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="mobile-nav-utilities">
              <DropdownMenuItem
                className="mobile-nav-utility-item"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun aria-hidden="true" />
                ) : (
                  <Moon aria-hidden="true" />
                )}
                {theme === 'dark' ? copy.theme.light : copy.theme.dark}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup className="mobile-nav-language">
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
