import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, Tag, Play, Camera, Map, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: { locale: string; countrySlug: string; citySlug: string; placeSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const place = await prisma.place.findUnique({
      where: { slug: params.placeSlug },
      include: { translations: true },
    });
    if (!place) return { title: 'Not Found' };
    const title =
      place.translations.find((t) => t.locale === params.locale)?.title ||
      place.translations.find((t) => t.locale === 'en')?.title;
    return { title: `${title} — Virtual Travel Platform` };
  } catch {
    return { title: 'Virtual Travel Platform' };
  }
}

export default async function PlacePage({ params }: Props) {
  const { locale, countrySlug, citySlug, placeSlug } = params;
  const t = await getTranslations('place');

  let place;
  try {
    place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      include: {
        translations: true,
        images: { orderBy: { sortOrder: 'asc' } },
        videos: true,
        city: {
          include: {
            translations: true,
            country: { include: { translations: true } },
          },
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
          <Link href={`/${locale}/countries/${countrySlug}/${citySlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('backToCity', { city: citySlug })}
          </Link>
        </div>
      </div>
    );
  }

  if (!place || place.city.slug !== citySlug || place.city.country.slug !== countrySlug) {
    notFound();
  }

  const title =
    place.translations.find((tr) => tr.locale === locale)?.title ||
    place.translations.find((tr) => tr.locale === 'en')?.title ||
    place.slug;

  const shortDesc =
    place.translations.find((tr) => tr.locale === locale)?.shortDescription ||
    place.translations.find((tr) => tr.locale === 'en')?.shortDescription;

  const fullDesc =
    place.translations.find((tr) => tr.locale === locale)?.fullDescription ||
    place.translations.find((tr) => tr.locale === 'en')?.fullDescription;

  const cityName =
    place.city.translations.find((tr) => tr.locale === locale)?.name ||
    place.city.translations.find((tr) => tr.locale === 'en')?.name;

  const countryName =
    place.city.country.translations.find((tr) => tr.locale === locale)?.name ||
    place.city.country.translations.find((tr) => tr.locale === 'en')?.name;

  const heroImage = place.images[0]?.url || place.coverImage;
  const video = place.videos[0];

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        {heroImage ? (
          <Image src={heroImage} alt={title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-blue-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b1f]/40 via-transparent to-[#050b1f]" />

        {/* Breadcrumb overlay */}
        <div className="absolute top-24 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="bg-black/30 backdrop-blur-sm hover:bg-black/50">
            <Link href={`/${locale}/countries/${countrySlug}/${citySlug}`}>
              <ArrowLeft className="w-4 h-4" />
              {cityName}
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Title card */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {place.city.country.flagEmoji && (
              <span className="text-2xl">{place.city.country.flagEmoji}</span>
            )}
            <div className="flex items-center gap-2 text-blue-300/70 text-sm">
              <span>{countryName}</span>
              <span>→</span>
              <span>{cityName}</span>
            </div>
            {place.category && (
              <Badge variant="secondary" className="capitalize">
                <Tag className="w-3 h-3 mr-1" />
                {place.category}
              </Badge>
            )}
            {place.featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">{title}</h1>

          {shortDesc && (
            <p className="text-blue-200/70 text-lg leading-relaxed max-w-3xl">{shortDesc}</p>
          )}

          {place.latitude && place.longitude && (
            <div className="flex items-center gap-2 mt-4 text-blue-400/60 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {place.latitude.toFixed(4)}°N, {place.longitude.toFixed(4)}°E
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description */}
            {fullDesc && (
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  {t('about')}
                </h2>
                <div className="prose-travel">
                  {fullDesc.split('\n\n').map((para, i) => (
                    <p key={i} className="text-blue-100/80 leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {place.images.length > 0 && (
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  {t('gallery')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {place.images.map((img, index) => (
                    <div
                      key={img.id}
                      className={`relative rounded-xl overflow-hidden ${
                        index === 0 && place.images.length > 2 ? 'sm:col-span-2' : ''
                      }`}
                      style={{ aspectRatio: index === 0 && place.images.length > 2 ? '16/7' : '4/3' }}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption || title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white/80 text-xs">{img.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Virtual Tour */}
            {video && (
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-400" />
                  {t('virtualTour')}
                </h2>
                {video.title && (
                  <p className="text-blue-300/70 text-sm mb-4">{video.title}</p>
                )}
                <div className="youtube-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                    title={video.title || title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location info card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                {t('location')}
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-blue-300/50 uppercase tracking-wider mb-1">
                    Country
                  </dt>
                  <dd className="text-white font-medium">
                    {place.city.country.flagEmoji} {countryName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-blue-300/50 uppercase tracking-wider mb-1">City</dt>
                  <dd className="text-white font-medium">{cityName}</dd>
                </div>
                {place.category && (
                  <div>
                    <dt className="text-xs text-blue-300/50 uppercase tracking-wider mb-1">
                      {t('category')}
                    </dt>
                    <dd className="text-white font-medium capitalize">{place.category}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Map */}
            {place.mapEmbedUrl && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-400" />
                  {t('map')}
                </h3>
                <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '75%' }}>
                  <iframe
                    src={place.mapEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0 rounded-xl"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            {/* Other places in this city */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-blue-300/70 uppercase tracking-wider mb-4">
                More in {cityName}
              </h3>
              <Link
                href={`/${locale}/countries/${countrySlug}/${citySlug}`}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group"
              >
                Explore all places
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
