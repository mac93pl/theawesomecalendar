import type { Metadata } from 'next';

import { NotFoundPage } from '@/components/not-found-page';

export const metadata: Metadata = {
  title: '404 — Nie znaleziono strony | The Awesome Calendar',
  description:
    'Ten adres nie istnieje. Odkryj The Awesome Calendar: darmowy kalendarz liniowy PDF A4 do druku, bez konta.',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="pl">
      <body style={{ margin: 0 }}>
        <NotFoundPage />
      </body>
    </html>
  );
}
