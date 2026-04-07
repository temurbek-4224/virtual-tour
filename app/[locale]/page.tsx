import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import LocationCard from "@/components/location/LocationCard";
import { getFeaturedLocations, getSiteConfig } from "@/lib/db";
import {
  Landmark,
  TreePine,
  Building2,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Globe,
  Map,
  Play,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("hero_title"),
    description: t("hero_subtitle"),
  };
}

const categories = [
  {
    key: "historical",
    icon: Landmark,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    key: "nature",
    icon: TreePine,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    key: "architecture",
    icon: Building2,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    key: "museum",
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    key: "bazaar",
    icon: ShoppingBag,
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

const stats = [
  { key: "stats_locations", value: "20+" },
  { key: "stats_cities", value: "8" },
  { key: "stats_languages", value: "3" },
  { key: "stats_visitors", value: "1K+" },
];

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const [t, tCat, featuredLocations, siteConfig] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "categories" }),
    getFeaturedLocations(6),
    getSiteConfig(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background — URL is managed via Admin → Site Settings */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${siteConfig.heroImageUrl}'), url('/images/placeholder.svg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Globe className="h-3.5 w-3.5" />
            <span>Virtual Tour Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            {t("hero_title")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40">
              <Link href="/explore">
                {t("hero_cta")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              <Link href="/about">{t("hero_secondary_cta")}</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.key}>
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 text-sm font-medium">
                  {t(stat.key as "stats_locations" | "stats_cities" | "stats_languages" | "stats_visitors")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Locations ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("featured_title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t("featured_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/explore">
                {t("cta_button")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("categories_title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t("categories_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(({ key, icon: Icon, color }) => (
              <Link
                key={key}
                href="/explore"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${color} transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">
                  {tCat(key as "historical" | "nature" | "architecture" | "museum" | "bazaar")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features highlight ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: "360° VR Experience",
                desc: "Immerse yourself with full 360-degree panoramic video tours of every location.",
                color: "text-blue-500 bg-blue-50",
              },
              {
                icon: Map,
                title: "Interactive Maps",
                desc: "Instantly open any location in Google Maps or Yandex Maps and get directions.",
                color: "text-emerald-500 bg-emerald-50",
              },
              {
                icon: Globe,
                title: "3 Languages",
                desc: "Full multilingual support in English, O'zbek and Русский for every page.",
                color: "text-purple-500 bg-purple-50",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card hover:shadow-md transition-shadow"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} mb-5`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("cta_title")}</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            {t("cta_subtitle")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-10 text-base shadow-lg"
          >
            <Link href="/explore">
              {t("cta_button")}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
