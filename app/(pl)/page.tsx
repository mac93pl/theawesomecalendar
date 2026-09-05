import { redirect } from 'next/navigation';

import { CalendarLanding } from '@/components/calendar-landing';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PolishHome({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  if (params.lang === 'en') redirect('/en');

  return <CalendarLanding initialLanguage="pl" />;
}
