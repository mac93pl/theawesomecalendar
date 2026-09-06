import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { SiteLanguage } from '@/lib/calendar';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function preferredLanguage(acceptLanguage: string | null): SiteLanguage {
  if (!acceptLanguage) return 'pl';

  const preferences = acceptLanguage
    .split(',')
    .map((entry, index) => {
      const [range, ...parameters] = entry.trim().split(';');
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith('q='),
      );
      const parsedQuality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1;

      return {
        index,
        language: range.toLowerCase().split('-')[0],
        quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
      };
    })
    .filter(
      (preference) =>
        preference.quality > 0 &&
        (preference.language === 'pl' || preference.language === 'en'),
    )
    .sort(
      (left, right) =>
        right.quality - left.quality || left.index - right.index,
    );

  return preferences[0]?.language === 'en' ? 'en' : 'pl';
}

export default async function LanguageEntry({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const queryLanguage = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;
  if (queryLanguage === 'pl' || queryLanguage === 'en') {
    redirect(`/${queryLanguage}`);
  }

  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get('awesome-calendar-language')?.value;
  if (savedLanguage === 'pl' || savedLanguage === 'en') {
    redirect(`/${savedLanguage}`);
  }

  const requestHeaders = await headers();
  redirect(`/${preferredLanguage(requestHeaders.get('accept-language'))}`);
}
