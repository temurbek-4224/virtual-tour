import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import PublicChrome from "@/components/layout/PublicChrome";
import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import LangSetter from "@/components/layout/LangSetter";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: {
      default: t("tagline"),
      template: `%s | ${t("tagline")}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (!routing.locales.includes(locale as "en" | "uz" | "ru")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      {/* Updates <html lang="…"> on the client for the current locale */}
      <LangSetter locale={locale} />

      <NextIntlClientProvider messages={messages}>
        <SessionProviderWrapper>
          <PublicChrome>{children}</PublicChrome>
        </SessionProviderWrapper>
      </NextIntlClientProvider>
    </>
  );
}
