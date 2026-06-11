import Link from 'next/link';
import { Globe, MapPin, Mail, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: 'Home' },
    { href: `/${locale}/destinations`, label: 'Destinations' },
  ];

  const countries = [
    { slug: 'uzbekistan', name: 'Uzbekistan 🇺🇿' },
    { slug: 'italy', name: 'Italy 🇮🇹' },
  ];

  return (
    <footer className="bg-[#020817] border-t border-blue-900/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Virtual</span>
                <span className="text-gradient"> Travel</span>
              </span>
            </Link>
            <p className="text-blue-200/60 text-sm leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-blue-300/40">
              <Heart className="w-3 h-3 text-red-400/60" />
              <span>{t('madeWith')}</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t('navigation')}</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t('explore')}</h3>
            <ul className="space-y-2.5">
              {countries.map((country) => (
                <li key={country.slug}>
                  <Link
                    href={`/${locale}/countries/${country.slug}`}
                    className="text-blue-200/60 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-500/50" />
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300/40 text-xs">
            {t('copyright', { year })}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-blue-300/40 hover:text-blue-300 text-xs transition-colors">
              {t('privacy')}
            </Link>
            <Link href="#" className="text-blue-300/40 hover:text-blue-300 text-xs transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
