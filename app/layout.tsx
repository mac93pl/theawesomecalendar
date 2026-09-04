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
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('awesome-calendar-theme');var dark=saved==='dark'||(saved!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light'}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
