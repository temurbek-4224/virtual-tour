'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
  uz: 'UZ',
};

const LOCALE_FULL: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbek",
};

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-blue-900/20 border border-blue-800/30 rounded-xl p-1">
      <Globe className="w-4 h-4 text-blue-400 ml-2 hidden sm:block" />
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          title={LOCALE_FULL[locale]}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            currentLocale === locale
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-blue-300/70 hover:text-white hover:bg-white/5'
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
