import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, ArrowRight, Tag, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Props = { params: { locale: string; countrySlug: string; citySlug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const city = await prisma.city.findUnique({
      where: { slug: params.citySlug },
      include: { translations: true },
    });
    if (!city) return { title: 'Not Found' };
    const name =
      city.translations.find((t) => t.locale === params.locale)?.name ||
      city.translations.find((t) => t.locale === 'en')?.name;
    return { title: `${name} — Virtual Travel Platform` };
  } catch {
    return { title: 'Virtual Travel Platform' };
  }
}

export default async function CityPage({ params: { locale, countrySlug, citySlug } }: Props) {
  const t = await getTranslations('city');

  let city;
  try {
    city = await prisma.city.findUnique({
      where: { slug: citySlug },
      include: {
        translations: true,
        country: { include: { translations: true } },
        places: {
          include: {
            translations: true,
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
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
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!city || city.country.slug !== countrySlug) notFound();

  const cityName =
    city.translations.find((tr) => tr.locale === locale)?.name ||
    city.translations.find((tr) => tr.locale === 'en')?.name ||
    city.slug;

  const cityDesc =
    city.translations.find((tr) => tr.locale === locale)?.description ||
    city.translations.find((tr) => tr.locale === 'en')?.description;

  const countryName =
    city.country.translations.find((tr) => tr.locale === locale)?.name ||
    city.country.translations.find((tr) => tr.locale === 'en')?.name;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 mb-12 overflow-hidden">
        {city.coverImage && (
          <Image src={city.coverImage} alt={cityName} fill className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b1f]/60 via-transparent to-[#050b1f]" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 px-4">
          <div className="flex items-center gap-2 text-blue-300/80 text-sm">
            <span>{city.country.flagEmoji}</span>
            <span>{countryName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white text-center">{cityName}</h1>
          {cityDesc && (
            <p className="text-blue-200/70 text-center max-w-2xl text-sm leading-relaxed">
              {cityDesc}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/countries/${countrySlug}`}>
              <ArrowLeft className="w-4 h-4" />
              {countryName}
            </Link>
          </Button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">{t('places')}</h2>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.places.map((place) => {
            const placeName =
              place.translations.find((tr) => tr.locale === locale)?.title ||
              place.translations.find((tr) => tr.locale === 'en')?.title ||
              place.slug;

            const placeShortDesc =
              place.translations.find((tr) => tr.locale === locale)?.shortDescription ||
              place.translations.find((tr) => tr.locale === 'en')?.shortDescription;

            const coverImage = place.images[0]?.url || place.coverImage;

            return (
              <Link
                key={place.id}
                href={`/${locale}/countries/${countrySlug}/${citySlug}/${place.slug}`}
                className="group glass-card-hover card-shine overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden rounded-t-2xl">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={placeName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900/40 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-blue-600/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {place.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge>Featured</Badge>
                    </div>
                  )}

                  {place.category && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-blue-300 text-xs font-medium rounded-full border border-blue-700/30 capitalize">
                        {place.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {placeName}
                  </h3>
                  {placeShortDesc && (
                    <p className="text-blue-200/60 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {placeShortDesc}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400/70 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cityName}
                    </span>
                    <span className="text-sm text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('explorePlace')} <ArrowRight className="w-4 h-4" />
                    </span>
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
