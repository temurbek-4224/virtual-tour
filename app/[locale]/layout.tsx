import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#050b1f] text-white font-['Inter',sans-serif] antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
