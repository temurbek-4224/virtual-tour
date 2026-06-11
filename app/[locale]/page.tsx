import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  MapPin,
  Play,
  ArrowRight,
  Globe,
  Star,
  Users,
  Video,
  Compass,
  Building2,
  Orbit,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: 'Virtual Travel Platform — Explore the World',
    description: t('hero.subtitle'),
  };
}

type FeaturedCountry = Prisma.CountryGetPayload<{
  include: {
    translations: true;
    cities: { include: { translations: true; _count: { select: { places: true } } } };
  };
}>;

type FeaturedCity = Prisma.CityGetPayload<{
  include: {
    translations: true;
    country: { include: { translations: true } };
    _count: { select: { places: true } };
  };
}>;

async function getHomeData(): Promise<{
  featuredCountries: FeaturedCountry[];
  featuredCities: FeaturedCity[];
  stats: [number, number, number];
}> {
  try {
    const [featuredCountries, featuredCities, stats] = await Promise.all([
      prisma.country.findMany({
        where: { featured: true },
        include: {
          translations: true,
          cities: { include: { translations: true, _count: { select: { places: true } } } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.city.findMany({
        where: { featured: true },
        include: {
          translations: true,
          country: { include: { translations: true } },
          _count: { select: { places: true } },
        },
        take: 6,
      }),
      Promise.all([prisma.country.count(), prisma.city.count(), prisma.place.count()]),
    ]);

    return { featuredCountries, featuredCities, stats };
  } catch {
    // Database unreachable — return safe empty fallbacks so the page still renders
    return {
      featuredCountries: [],
      featuredCities: [],
      stats: [0, 0, 0],
    };
  }
}

// ─── Static showcase data for countries not yet in DB ───────────────────────
// These are purely frontend presentation entries. DB countries override them.
const SHOWCASE_COUNTRIES = [
  {
    slug: 'uzbekistan',
    flag: '🇺🇿',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    names: { en: 'Uzbekistan', ru: 'Узбекистан', uz: "O'zbekiston" },
    descs: {
      en: 'Home of Samarkand, Bukhara & Khiva — the legendary jewels of the ancient Silk Road.',
      ru: 'Самарканд, Бухара и Хива — легендарные жемчужины Великого шёлкового пути.',
      uz: "Samarqand, Buxoro va Xiva — qadimgi Ipak yo'lining afsonaviy gavharlari.",
    },
    staticCities: 4,
    staticPlaces: 10,
    liveLink: true,
  },
  {
    slug: 'italy',
    flag: '🇮🇹',
    image:
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80',
    names: { en: 'Italy', ru: 'Италия', uz: 'Italiya' },
    descs: {
      en: 'The Colosseum, Vatican, Trevi Fountain — centuries of art and history in one eternal country.',
      ru: 'Колизей, Ватикан, фонтан Треви — века искусства и истории в одной вечной стране.',
      uz: "Kolizey, Vatikan, Trevi favvorasi — bir abadiy mamlakatda san'at va tarixning asrlari.",
    },
    staticCities: 1,
    staticPlaces: 3,
    liveLink: true,
  },
  {
    slug: 'france',
    flag: '🇫🇷',
    image:
      'https://images.unsplash.com/photo-1502602965640-05b8dc9ae9cd?auto=format&fit=crop&w=800&q=80',
    names: { en: 'France', ru: 'Франция', uz: 'Fransiya' },
    descs: {
      en: 'Paris, the City of Light — the Eiffel Tower, Louvre, and world-renowned cuisine await.',
      ru: 'Париж, Город Света — Эйфелева башня, Лувр и всемирно известная кухня ждут вас.',
      uz: "Parij, Nur shahri — Eyfel minorasi, Luvrё va dunyoga mashhur oshxona sizni kutmoqda.",
    },
    staticCities: 2,
    staticPlaces: 8,
    liveLink: false,
  },
  {
    slug: 'japan',
    flag: '🇯🇵',
    image:
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    names: { en: 'Japan', ru: 'Япония', uz: 'Yaponiya' },
    descs: {
      en: 'From cherry-blossom temples of Kyoto to the neon skyline of Tokyo — ancient meets futuristic.',
      ru: 'От храмов Киото в цветах сакуры до неонового горизонта Токио — древнее встречает футуристическое.',
      uz: "Kyotoning gilos guli ibodatxonalaridan Tokioning neon osmon qirrasigacha — qadimgi zamonaviy bilan uchrashadi.",
    },
    staticCities: 3,
    staticPlaces: 11,
    liveLink: false,
  },
  {
    slug: 'turkey',
    flag: '🇹🇷',
    image:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    names: { en: 'Turkey', ru: 'Турция', uz: 'Turkiya' },
    descs: {
      en: 'Istanbul bridges two continents — Hagia Sophia, the Grand Bazaar, and the Bosphorus beckon.',
      ru: 'Стамбул соединяет два континента — Айя-София, Гранд-базар и Босфор манят к себе.',
      uz: "Istanbul ikki qit'ani bog'laydi — Muqaddas Sofiya, Katta bozor va Bosfor sizi chaqirmoqda.",
    },
    staticCities: 2,
    staticPlaces: 9,
    liveLink: false,
  },
  {
    slug: 'uae',
    flag: '🇦🇪',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    names: { en: 'UAE', ru: 'ОАЭ', uz: 'BAA' },
    descs: {
      en: 'Dubai and Abu Dhabi — where futuristic skyscrapers rise from golden desert dunes.',
      ru: 'Дубай и Абу-Даби — где футуристические небоскрёбы поднимаются из золотых барханов.',
      uz: "Dubay va Abu-Dabi — zamonaviy osmono'par binolar oltin sahro qumloqlaridan ko'tariladi.",
    },
    staticCities: 2,
    staticPlaces: 7,
    liveLink: false,
  },
  {
    slug: 'usa',
    flag: '🇺🇸',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    names: { en: 'USA', ru: 'США', uz: 'AQSH' },
    descs: {
      en: 'New York, Grand Canyon, Golden Gate — America\'s iconic wonders span a continent.',
      ru: 'Нью-Йорк, Гранд-Каньон, Золотые ворота — культовые чудеса Америки на целый континент.',
      uz: "Nyu-York, Grand Kanyon, Oltin eshik — Amerikaning ikonik mo'jizalari bir qit'a bo'ylab.",
    },
    staticCities: 3,
    staticPlaces: 12,
    liveLink: false,
  },
] as const;

type ShowcaseEntry = {
  slug: string;
  flag: string;
  image: string;
  href: string;
  name: string;
  desc: string;
  cities: number;
  places: number;
  live: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('home');
  const { featuredCountries, featuredCities, stats } = await getHomeData();
  const [countryCount, , placeCount] = stats;

  const statItems = [
    { value: `${placeCount}+`, label: t('stats.destinations'), icon: MapPin },
    { value: `${countryCount}+`, label: t('stats.countries'), icon: Globe },
    { value: `${placeCount}+`, label: t('stats.virtualTours'), icon: Video },
    { value: '10K+', label: t('stats.visitors'), icon: Users },
  ];

  // Build the merged showcase list (DB data takes priority where available)
  const dbBySlug = new Map(featuredCountries.map((c) => [c.slug, c]));
  const loc = locale as 'en' | 'ru' | 'uz';

  const mergedCountries: ShowcaseEntry[] = SHOWCASE_COUNTRIES.map((sc) => {
    const db = dbBySlug.get(sc.slug);
    const name =
      db?.translations.find((tr) => tr.locale === locale)?.name ||
      db?.translations.find((tr) => tr.locale === 'en')?.name ||
      sc.names[loc] ||
      sc.names.en;
    const desc =
      db?.translations.find((tr) => tr.locale === locale)?.description ||
      db?.translations.find((tr) => tr.locale === 'en')?.description ||
      sc.descs[loc] ||
      sc.descs.en;
    const cities = db ? db.cities.length : sc.staticCities;
    const places = db
      ? db.cities.reduce((a, c) => a + (c._count?.places || 0), 0)
      : sc.staticPlaces;

    return {
      slug: sc.slug,
      flag: sc.flag,
      image: db?.coverImage || sc.image,
      href: sc.liveLink ? `/${locale}/countries/${sc.slug}` : `/${locale}/destinations`,
      name,
      desc,
      cities,
      places,
      live: sc.liveLink || dbBySlug.has(sc.slug),
    };
  });

  return (
    <div className="overflow-x-hidden">
      {/* ================================================================
          HERO SECTION
      ================================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=60')",
          }}
        />
        {/* Ambient orbs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-blue-400/8 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-3/4 left-1/3 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8 fade-in-up">
            <Star className="w-4 h-4 fill-current text-blue-400" />
            {t('hero.badge')}
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-[80px] font-black mb-6 leading-[1.05] tracking-tight fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-white">{t('hero.title')}</span>
            <br />
            <span className="text-gradient">{t('hero.titleAccent')}</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-blue-200/60 max-w-2xl mx-auto mb-12 leading-relaxed fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('hero.subtitle')}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              href={`/${locale}/destinations`}
              className="group inline-flex items-center gap-2.5 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl text-base transition-all duration-300 shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 hover:shadow-xl hover:-translate-y-0.5"
            >
              <MapPin className="w-5 h-5" />
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/destinations`}
              className="group inline-flex items-center gap-2.5 px-7 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl text-base border border-white/15 hover:border-blue-400/40 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 text-blue-400" />
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          <div
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {statItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.07] hover:border-blue-500/30 transition-all duration-300"
              >
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-3xl font-black text-white tracking-tight">{item.value}</span>
                <span className="text-xs text-blue-300/50 font-medium uppercase tracking-wider text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-blue-400 to-transparent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
        </div>
      </section>

      {/* ================================================================
          FEATURED DESTINATIONS
      ================================================================ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">{t('featured.badge')}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-blue-200/50 max-w-xl mx-auto text-lg leading-relaxed">
              {t('featured.subtitle')}
            </p>
          </div>

          {featuredCities.length === 0 ? (
            <div className="text-center py-16 text-blue-300/40">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No featured destinations yet. Add some via the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCities.map((city, idx) => {
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
                const isHero = idx === 0;

                return (
                  <Link
                    key={city.id}
                    href={`/${locale}/countries/${city.country.slug}/${city.slug}`}
                    className={`group relative overflow-hidden rounded-3xl block cursor-pointer
                      shadow-lg hover:shadow-2xl hover:shadow-blue-500/20
                      hover:-translate-y-1.5 transition-all duration-500
                      ${isHero ? 'md:col-span-2 lg:col-span-1 aspect-[16/10]' : 'aspect-[4/3]'}`}
                  >
                    <Image
                      src={
                        city.coverImage ||
                        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={cityName}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white/80 font-medium">
                        <span>{city.country.flagEmoji}</span>
                        {countryName}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-600/70 backdrop-blur-sm text-xs text-white font-semibold">
                        <MapPin className="w-3 h-3" />
                        {city._count.places}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-2xl font-bold text-white mb-1.5 leading-tight">
                        {cityName}
                      </h3>
                      {cityDesc && (
                        <p className="text-white/55 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {cityDesc}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Compass className="w-4 h-4" />
                        Explore destination
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/destinations`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-blue-800/40 text-blue-300 hover:text-white hover:border-blue-500/60 hover:bg-blue-900/20 text-sm font-medium transition-all duration-300"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          UZBEKISTAN SPOTLIGHT — fixed CSS-grid mosaic
      ================================================================ */}
      <section
        className="py-24 border-y border-blue-900/20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #071022 0%, #050b1f 50%, #071530 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            {/* Image mosaic — CSS grid, zero absolute positioning */}
            <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-[480px]">
              <div className="row-span-2 rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50">
                <Image
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=80"
                  alt="Registan Square, Samarkand"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white/80 text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    📍 Registan, Samarkand
                  </span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative shadow-xl shadow-black/40">
                <Image
                  src="https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=500&q=80"
                  alt="Itchan Kala, Khiva"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white/80 text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    📍 Khiva
                  </span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative shadow-xl shadow-black/40">
                <Image
                  src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=500&q=80"
                  alt="Kalon Minaret, Bukhara"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white/80 text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    📍 Bukhara
                  </span>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-3 mb-6 self-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-900/30 border border-blue-600/30 flex items-center justify-center text-2xl shadow-lg">
                  🇺🇿
                </div>
                <Badge variant="secondary">{t('uzbekistan.badge')}</Badge>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
                {t('uzbekistan.title')}
              </h2>
              <p className="text-blue-200/55 text-lg leading-relaxed mb-8">
                {t('uzbekistan.subtitle')}
              </p>

              <div className="flex flex-wrap gap-2.5 mb-10">
                {[
                  { name: 'Samarkand', slug: 'samarkand' },
                  { name: 'Bukhara', slug: 'bukhara' },
                  { name: 'Khiva', slug: 'khiva' },
                  { name: 'Tashkent', slug: 'tashkent' },
                ].map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${locale}/countries/uzbekistan/${city.slug}`}
                    className="group/chip inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/25 border border-blue-800/30 hover:bg-blue-800/30 hover:border-blue-600/50 text-blue-200 text-sm font-medium transition-all duration-200"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {city.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/chip:opacity-100 group-hover/chip:translate-x-0 transition-all duration-200" />
                  </Link>
                ))}
              </div>

              <div>
                <Link
                  href={`/${locale}/countries/uzbekistan`}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                >
                  {t('uzbekistan.cta')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          360° VIRTUAL TOUR CTA
      ================================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-blue-700/30 bg-gradient-to-br from-[#071022] via-[#0a1535] to-[#071022] p-8 sm:p-12">
            {/* Background orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/8 rounded-full blur-[50px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Orbit className="w-5 h-5 text-blue-400" />
                  </div>
                  <Badge className="text-blue-300 border-blue-700/50 bg-blue-900/30">
                    {t('virtualTour.badge')}
                  </Badge>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                  {t('virtualTour.title')}
                </h2>
                <p className="text-blue-200/55 text-base sm:text-lg max-w-xl leading-relaxed">
                  {t('virtualTour.subtitle')}
                </p>
              </div>

              <Link
                href={`/${locale}/panorama`}
                className="group flex-shrink-0 inline-flex items-center gap-2.5 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl text-base transition-all duration-300 shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Orbit className="w-5 h-5" />
                {t('virtualTour.cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          BROWSE BY COUNTRY — Bento grid (7 destinations)
      ================================================================ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-700/50 text-blue-400 bg-blue-900/20">
              {t('countries.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t('countries.title')}
            </h2>
            <p className="text-blue-200/50 text-lg max-w-xl mx-auto leading-relaxed">
              {t('countries.subtitle')}
            </p>
          </div>

          {/* ── Bento grid — desktop ── */}
          {/*
            6-column grid on lg+:
              Row 1: Uzbekistan (col-span-4)  | Italy (col-span-2)
              Row 2: France (col-span-2)      | Japan (col-span-2)  | Turkey (col-span-2)
              Row 3: UAE (col-span-3)         | USA (col-span-3)
          */}
          <div className="hidden lg:grid grid-cols-6 gap-4 auto-rows-[240px]">
            {mergedCountries.map((country, idx) => {
              const colSpan =
                idx === 0 ? 'col-span-4' :  // Uzbekistan — wide
                idx === 1 ? 'col-span-2' :  // Italy
                idx <= 4  ? 'col-span-2' :  // France, Japan, Turkey
                            'col-span-3';   // UAE, USA

              return (
                <CountryCard key={country.slug} country={country} colSpan={colSpan} locale={locale} />
              );
            })}
          </div>

          {/* ── 2-column grid — tablet / mobile ── */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mergedCountries.map((country) => (
              <CountryCard key={country.slug} country={country} colSpan="" locale={locale} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex items-center justify-center mt-14 gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-900/40 to-transparent max-w-xs" />
            <Link
              href={`/${locale}/destinations`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-blue-600/10 border border-blue-700/30 text-blue-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/50 text-sm font-medium transition-all duration-300 whitespace-nowrap"
            >
              <Globe className="w-4 h-4" />
              Explore all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-blue-900/40 to-transparent max-w-xs" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Country card sub-component ──────────────────────────────────────────────
function CountryCard({
  country,
  colSpan,
  locale,
}: {
  country: ShowcaseEntry;
  colSpan: string;
  locale: string;
}) {
  return (
    <Link
      href={country.href}
      className={`${colSpan} group relative overflow-hidden rounded-2xl block cursor-pointer
        shadow-lg hover:shadow-2xl hover:shadow-blue-500/15
        hover:-translate-y-1 transition-all duration-500
        lg:h-auto h-56`}
    >
      {/* Background image */}
      <Image
        src={country.image}
        alt={country.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
      {/* Blue tint on hover */}
      <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-500" />
      {/* Hover glow ring */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-blue-500/25 transition-all duration-500" />

      {/* "Coming Soon" badge for non-live entries */}
      {!country.live && (
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/60 text-[11px] font-medium">
            Coming soon
          </span>
        </div>
      )}

      {/* Arrow — top right */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 group-hover:bg-blue-600/60 group-hover:border-blue-500/50 flex items-center justify-center transition-all duration-300">
        <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Flag + name */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-3xl leading-none drop-shadow-lg">{country.flag}</span>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">{country.name}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300/70 font-medium mt-0.5">
              <Building2 className="w-3 h-3" />
              <span>{country.cities}</span>
              <span className="opacity-40">·</span>
              <MapPin className="w-3 h-3" />
              <span>{country.places} places</span>
            </div>
          </div>
        </div>
        {/* Description — shown on larger cards, hidden on small */}
        <p className="text-white/55 text-xs leading-relaxed line-clamp-2 hidden sm:block">
          {country.desc}
        </p>
      </div>
    </Link>
  );
}
