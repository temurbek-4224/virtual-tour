import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { MapPin, ArrowRight, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Destinations — Virtual Travel Platform',
};

type DestinationCountry = Prisma.CountryGetPayload<{
  include: {
    translations: true;
    cities: {
      include: {
        translations: true;
        _count: { select: { places: true } };
      };
    };
  };
}>;

async function getAllDestinations(): Promise<DestinationCountry[]> {
  try {
    return await prisma.country.findMany({
      include: {
        translations: true,
        cities: {
          include: {
            translations: true,
            _count: { select: { places: true } },
          },
          orderBy: { featured: 'desc' },
        },
      },
      orderBy: { featured: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function DestinationsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('destinations');
  const countries = await getAllDestinations();
  const dbUnavailable = countries.length === 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t('title')}</h1>
          <p className="text-blue-200/60 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Countries and Cities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {dbUnavailable && (
          <div className="text-center py-20">
            <Globe className="w-14 h-14 mx-auto text-blue-400/20 mb-4" />
            <p className="text-blue-300/50 text-lg font-medium">Destinations are temporarily unavailable.</p>
            <p className="text-blue-300/30 text-sm mt-1">Please try again in a moment.</p>
          </div>
        )}
        {countries.map((country) => {
          const countryName =
            country.translations.find((t) => t.locale === locale)?.name ||
            country.translations.find((t) => t.locale === 'en')?.name ||
            country.slug;
          const countryDesc =
            country.translations.find((t) => t.locale === locale)?.description ||
            country.translations.find((t) => t.locale === 'en')?.description;

          return (
            <div key={country.id}>
              {/* Country header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{country.flagEmoji || '🌍'}</span>
                    <h2 className="text-3xl font-black text-white">{countryName}</h2>
                  </div>
                  {countryDesc && (
                    <p className="text-blue-200/60 max-w-2xl text-sm leading-relaxed">
                      {countryDesc}
                    </p>
                  )}
                </div>
                <Link
                  href={`/${locale}/countries/${country.slug}`}
                  className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Cities grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {country.cities.map((city) => {
                  const cityName =
                    city.translations.find((t) => t.locale === locale)?.name ||
                    city.translations.find((t) => t.locale === 'en')?.name ||
                    city.slug;
                  const cityDesc =
                    city.translations.find((t) => t.locale === locale)?.description ||
                    city.translations.find((t) => t.locale === 'en')?.description;

                  return (
                    <Link
                      key={city.id}
                      href={`/${locale}/countries/${country.slug}/${city.slug}`}
                      className="group relative overflow-hidden rounded-2xl aspect-[3/4] block"
                    >
                      <Image
                        src={
                          city.coverImage ||
                          'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={cityName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />

                      {city.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-blue-600/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                            Featured
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-bold text-white mb-1">{cityName}</h3>
                        <p className="text-blue-200/60 text-xs line-clamp-2 mb-2">{cityDesc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 text-xs font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {city._count.places} places
                          </span>
                          <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile view all */}
              <div className="sm:hidden mt-4">
                <Link
                  href={`/${locale}/countries/${country.slug}`}
                  className="flex items-center justify-center gap-2 text-blue-400 text-sm font-medium"
                >
                  View all cities in {countryName} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
