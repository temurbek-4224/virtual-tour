"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type Location } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationImage from "@/components/ui/location-image";

interface LocationCardProps {
  location: Location;
  className?: string;
}

export default function LocationCard({ location, className }: LocationCardProps) {
  const locale = useLocale() as "en" | "uz" | "ru";
  const t = useTranslations("explore");
  const tCat = useTranslations("categories");
  const translation = location.translations[locale];

  const categoryKey = location.category as
    | "historical"
    | "nature"
    | "architecture"
    | "museum"
    | "bazaar"
    | "mosque"
    | "mausoleum";

  return (
    <Link href={`/location/${location.slug}`} className={cn("group block", className)}>
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <LocationImage
            src={location.coverImage}
            alt={translation.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/90 text-gray-800 hover:bg-white border-0 text-xs font-semibold shadow-sm backdrop-blur-sm">
              {tCat(categoryKey)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start gap-1.5 mb-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              {location.region}
            </span>
          </div>
          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors leading-snug">
            {translation.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
            {translation.shortDescription}
          </p>
          <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
            <span>{t("view_details")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
