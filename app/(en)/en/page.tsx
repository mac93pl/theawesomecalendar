import { redirect } from 'next/navigation';

import { CalendarLanding } from '@/components/calendar-landing';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EnglishHome({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  if (params.lang === 'pl') redirect('/');

  return <CalendarLanding initialLanguage="en" />;
}
