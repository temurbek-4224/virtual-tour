import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = { params: { locale: string; countrySlug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const country = await prisma.country.findUnique({
      where: { slug: params.countrySlug },
      include: { translations: true },
    });
    if (!country) return { title: 'Not Found' };
    const name =
      country.translations.find((t) => t.locale === params.locale)?.name ||
      country.translations.find((t) => t.locale === 'en')?.name;
    return { title: `${name} — Virtual Travel Platform` };
  } catch {
    return { title: 'Virtual Travel Platform' };
  }
}

export default async function CountryPage({ params: { locale, countrySlug } }: Props) {
  const t = await getTranslations('country');

  let country;
  try {
    country = await prisma.country.findUnique({
      where: { slug: countrySlug },
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
    });
  } catch {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto text-blue-400/20 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Service Temporarily Unavailable</h2>
          <p className="text-blue-300/50 mb-8">We&apos;re having trouble reaching the database. Please try again shortly.</p>
          <Link href={`/${locale}/destinations`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('backToDestinations')}
          </Link>
        </div>
      </div>
    );
  }

  if (!country) notFound();

  const name =
    country.translations.find((t) => t.locale === locale)?.name ||
    country.translations.find((t) => t.locale === 'en')?.name ||
    country.slug;

  const description =
    country.translations.find((t) => t.locale === locale)?.description ||
    country.translations.find((t) => t.locale === 'en')?.description;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 mb-12 overflow-hidden">
        {country.coverImage && (
          <Image src={country.coverImage} alt={name || ''} fill className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b1f]/60 via-transparent to-[#050b1f]" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 px-4">
          <div className="text-7xl">{country.flagEmoji}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white text-center">
            {name}
          </h1>
          {description && (
            <p className="text-blue-200/70 text-center max-w-2xl text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-10">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/destinations`}>
              <ArrowLeft className="w-4 h-4" />
              {t('backToDestinations')}
            </Link>
          </Button>
        </div>

        {/* Cities */}
        <h2 className="text-2xl font-bold text-white mb-8">{t('cities')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                href={`/${locale}/countries/${countrySlug}/${city.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[16/9] block"
              >
                <Image
                  src={
                    city.coverImage ||
                    'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cityName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{cityName}</h3>
                  <p className="text-blue-200/60 text-xs line-clamp-2 mb-3">{cityDesc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 text-xs flex items-center gap-1">
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
      </div>
    </div>
  );
}
