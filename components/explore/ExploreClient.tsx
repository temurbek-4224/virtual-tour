"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo } from "react";
import LocationCard from "@/components/location/LocationCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location, Locale } from "@/lib/data";

const FILTER_KEYS = [
  "all",
  "historical",
  "nature",
  "architecture",
  "museum",
  "bazaar",
  "mausoleum",
] as const;

interface ExploreClientProps {
  locations: Location[];
}

export default function ExploreClient({ locations }: ExploreClientProps) {
  const t = useTranslations("explore");
  const tCat = useTranslations("categories");
  const locale = useLocale() as Locale;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = locations;

    if (activeFilter !== "all") {
      result = result.filter((loc) => loc.category === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((loc) => {
        const tr = loc.translations[locale];
        return (
          tr.name.toLowerCase().includes(q) ||
          tr.shortDescription.toLowerCase().includes(q) ||
          loc.region.toLowerCase().includes(q) ||
          loc.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [search, activeFilter, locale, locations]);

  const filterLabel = (key: string): string => {
    if (key === "all") return t("filter_all");
    const map: Record<string, string> = {
      historical: t("filter_historical"),
      nature: t("filter_nature"),
      architecture: t("filter_architecture"),
      museum: t("filter_museum"),
      bazaar: t("filter_bazaar"),
      mausoleum: tCat("mausoleum"),
    };
    return map[key] ?? key;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-4 sm:px-6">
        <div className="container text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            {t("subtitle")}
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className={cn(
                "w-full h-12 pl-11 pr-10 rounded-xl border border-border bg-background",
                "text-sm shadow-sm transition-shadow",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                "placeholder:text-muted-foreground"
              )}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 pb-20">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex gap-2">
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150",
                  activeFilter === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {filterLabel(key)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {t("results_count", { count: filtered.length })}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filtered.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">{t("no_results")}</h3>
            <p className="text-muted-foreground">{t("no_results_sub")}</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="mt-6 text-primary text-sm hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
