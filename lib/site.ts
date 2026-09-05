export const SITE_NAME = 'The Awesome Calendar';
export const SITE_ORIGIN = 'https://theawesomecalendar.com';

export function localizedSiteUrl(language: 'en' | 'pl') {
  return language === 'en' ? `${SITE_ORIGIN}/en` : `${SITE_ORIGIN}/`;
}
