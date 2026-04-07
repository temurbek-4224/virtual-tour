import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/data";
import { locations } from "@/lib/data";
import {
  getLocationBySlug,
  getRelatedLocations,
} from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LocationCard from "@/components/location/LocationCard";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Navigation,
  Tag,
  ImageIcon,
  Play,
  Map,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import LocationImage from "@/components/ui/location-image";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { Metadata } from "next";

type Props = {
  params: { slug: string; locale: string };
};

export async function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await Promise.resolve(params);
  const location = await getLocationBySlug(slug);
  if (!location) return {};
  const tr = location.translations[locale as Locale];
  return {
    title: `${tr.name} — Virtual Tour Uzbekistan`,
    description: tr.shortDescription,
    openGraph: {
      title: tr.name,
      description: tr.shortDescription,
      images: [{ url: location.coverImage }],
    },
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug, locale } = await Promise.resolve(params);
  const location = await getLocationBySlug(slug);

  if (!location) notFound();

  const loc = locale as Locale;
  const t = await getTranslations({ locale: loc, namespace: "location" });
  const tCat = await getTranslations({ locale: loc, namespace: "categories" });
  const translation = location.translations[loc];
  const didYouKnow = location.didYouKnow[loc];

  // Map URLs: use admin-saved direct links; fall back to coordinate-based URLs
  const googleMapsUrl =
    location.googleMapsUrl?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  const yandexMapsUrl =
    location.yandexMapsUrl?.trim() ||
    `https://maps.yandex.com/?ll=${location.lng},${location.lat}&z=15`;
  const directionsUrl =
    location.directionsUrl?.trim() ||
    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  // Embedded map always uses coordinates (no equivalent for direct-link embeds)
  const googleEmbedUrl = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;

  const relatedLocations = await getRelatedLocations(
    location.id,
    location.category,
    location.region,
    3
  );

  const categoryKey = location.category as
    | "historical"
    | "nature"
    | "architecture"
    | "museum"
    | "bazaar"
    | "mosque"
    | "mausoleum";

  // Separate cover from the rest of the gallery
  const galleryImages =
    location.images.length > 1 ? location.images : [location.coverImage];

  // YouTube embed URLs — null when the field is empty or not a valid YT link
  const videoEmbedUrl = getYouTubeEmbedUrl(location.youtubeUrl);
  const vrEmbedUrl    = getYouTubeEmbedUrl(location.youtubeVrUrl);

  return (
    <div className="min-h-screen">
      {/* ── Hero Image ── */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <LocationImage
          src={location.coverImage}
          alt={translation.name}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-6 z-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/50 transition-colors border border-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("back")}
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container">
            <Badge
              variant="secondary"
              className="mb-3 bg-white/90 text-gray-800 border-0 font-semibold shadow-sm"
            >
              {tCat(categoryKey)}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              {translation.name}
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{location.region}, Uzbekistan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Short description callout */}
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
              <p className="text-lg font-medium text-foreground/90 leading-relaxed italic">
                &ldquo;{translation.shortDescription}&rdquo;
              </p>
            </div>

            {/* Full description */}
            <div>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-primary" />
                {t("description")}
              </h2>
              <div className="space-y-4">
                {translation.fullDescription
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground leading-relaxed text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {/* ── Did You Know? ── */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
              {/* Decorative background circle */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-orange-100/40 pointer-events-none" />

              <div className="relative flex items-start gap-4">
                <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-300/50">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-base mb-2">
                    {t("did_you_know")}
                  </h3>
                  <p className="text-amber-800/90 text-sm leading-relaxed">
                    {didYouKnow}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Image Gallery ── */}
            <div>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2.5">
                <ImageIcon className="h-5 w-5 text-primary" />
                {t("gallery")}
              </h2>
              <div
                className={
                  galleryImages.length === 1
                    ? "grid grid-cols-1 gap-4"
                    : galleryImages.length === 2
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 gap-4"
                }
              >
                {/* First image — larger featured */}
                <div
                  className={`overflow-hidden rounded-2xl border border-border shadow-sm ${
                    galleryImages.length >= 3 ? "sm:col-span-2" : ""
                  }`}
                >
                  <LocationImage
                    src={galleryImages[0]}
                    alt={`${translation.name} — 1`}
                    className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                </div>
                {/* Remaining images */}
                {galleryImages.slice(1).map((img, i) => (
                  <div
                    key={i + 1}
                    className="overflow-hidden rounded-2xl border border-border shadow-sm"
                  >
                    <LocationImage
                      src={img}
                      alt={`${translation.name} — ${i + 2}`}
                      className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Video Tour ── */}
            {videoEmbedUrl ? (
              <div>
                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2.5">
                  <Play className="h-5 w-5 text-primary" />
                  {t("video_title")}
                </h2>
                <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-sm">
                  <iframe
                    src={videoEmbedUrl}
                    title={`${translation.name} — ${t("video_title")}`}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    style={{ border: 0, display: "block" }}
                  />
                </div>
              </div>
            ) : null}

            {/* ── 360° VR Experience ── */}
            {vrEmbedUrl ? (
              <div>
                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2.5">
                  <Play className="h-5 w-5 text-primary" />
                  {t("vr_title")}
                </h2>
                <div className="rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm">
                  {/* Embed */}
                  <div className="aspect-video">
                    <iframe
                      src={vrEmbedUrl}
                      title={`${translation.name} — ${t("vr_title")}`}
                      width="100%"
                      height="100%"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      style={{ border: 0, display: "block" }}
                    />
                  </div>
                  {/* VR hint bar below the player */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 border-t border-primary/10">
                    <span className="text-base">🥽</span>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {t("vr_hint")}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-6">

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm sticky top-24">
              <div className="p-4 border-b border-border bg-card">
                <h3 className="font-semibold flex items-center gap-2">
                  <Map className="h-4 w-4 text-primary" />
                  {t("map_title")}
                </h3>
              </div>
              <div className="aspect-square">
                <iframe
                  src={googleEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${translation.name}`}
                />
              </div>
              <div className="p-4 space-y-2.5 bg-card">
                <Button asChild className="w-full" size="sm">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    {t("map_open_google")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <a
                    href={yandexMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    {t("map_open_yandex")}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-3.5 w-3.5 mr-1.5" />
                    {t("map_directions")}
                  </a>
                </Button>
              </div>
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                    {t("region_label")}
                  </p>
                  <p className="font-medium text-sm">{location.region}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">
                    {t("tags_label")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {location.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Locations ── */}
        {relatedLocations.length > 0 && (
          <div className="mt-20 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">{t("related_title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedLocations.map((rel) => (
                <LocationCard key={rel.id} location={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
