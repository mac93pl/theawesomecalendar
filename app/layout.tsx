import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'The Awesome Calendar — kalendarz liniowy do druku',
  description:
    'Wygeneruj własny kalendarz liniowy, wydrukuj go na kartkach A4 i sklej w jedną czytelną oś czasu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
