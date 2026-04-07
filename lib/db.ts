// ─────────────────────────────────────────────────────────────────────────────
// Database Access Layer
//
// All public functions fall back to local mock data automatically when the
// DATABASE_URL is not configured or Neon is unreachable. This means the app
// works immediately without any database setup, and switches to real data once
// you paste your Neon connection string and run the seed.
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from "./prisma";
import {
  locations as localLocations,
  type Location,
  type Locale,
} from "./data";
import type { Prisma } from "@prisma/client";

// ─── DB-connected check ──────────────────────────────────────────────────────

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return (
    url.length > 0 &&
    !url.includes("USER:PASSWORD") &&
    !url.includes("PLACEHOLDER") &&
    url.startsWith("postgresql")
  );
}

// ─── Prisma result → App Location mapper ─────────────────────────────────────

type PrismaLocationFull = Prisma.LocationGetPayload<{
  include: { translations: true; category: true; region: true };
}>;

function mapDbLocation(loc: PrismaLocationFull): Location {
  const getTr = (locale: Locale) => {
    const tr = loc.translations.find((t) => t.locale === locale);
    return {
      name: tr?.name ?? "",
      shortDescription: tr?.shortDescription ?? "",
      fullDescription: tr?.fullDescription ?? "",
    };
  };

  // Cast to access columns added after the last `prisma generate`.
  // These columns exist in the DB (added via ALTER TABLE) and will appear
  // in the raw query result even if the generated client types don't yet list them.
  const row = loc as typeof loc & {
    googleMapsUrl?: string;
    yandexMapsUrl?: string;
    directionsUrl?: string;
  };

  return {
    id: String(loc.id),
    slug: loc.slug,
    category: loc.category.slug,
    region: loc.region.nameEn,
    coverImage: loc.coverImage,
    lat: loc.latitude,
    lng: loc.longitude,
    youtubeUrl: loc.youtubeUrl,
    youtubeVrUrl: loc.youtubeVrUrl,
    googleMapsUrl: row.googleMapsUrl ?? "",
    yandexMapsUrl: row.yandexMapsUrl ?? "",
    directionsUrl: row.directionsUrl ?? "",
    didYouKnow: {
      en: loc.didYouKnowEn,
      uz: loc.didYouKnowUz,
      ru: loc.didYouKnowRu,
    },
    translations: {
      en: getTr("en"),
      uz: getTr("uz"),
      ru: getTr("ru"),
    },
    images: loc.galleryImages,
    tags: loc.tags,
  };
}

// ─── Public: All locations ────────────────────────────────────────────────────

export async function getLocations(publishedOnly = true): Promise<Location[]> {
  if (!isDbConfigured()) return localLocations;
  try {
    const rows = await prisma.location.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      include: { translations: true, category: true, region: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(mapDbLocation);
  } catch {
    return localLocations;
  }
}

// ─── Public: Location by slug ─────────────────────────────────────────────────

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  if (!isDbConfigured()) {
    return localLocations.find((l) => l.slug === slug) ?? null;
  }
  try {
    const row = await prisma.location.findUnique({
      where: { slug },
      include: { translations: true, category: true, region: true },
    });
    return row ? mapDbLocation(row) : null;
  } catch {
    return localLocations.find((l) => l.slug === slug) ?? null;
  }
}

// ─── Public: Featured locations ──────────────────────────────────────────────

export async function getFeaturedLocations(limit = 6): Promise<Location[]> {
  if (!isDbConfigured()) return localLocations.slice(0, limit);
  try {
    const rows = await prisma.location.findMany({
      where: { isPublished: true },
      include: { translations: true, category: true, region: true },
      take: limit,
      orderBy: { createdAt: "asc" },
    });
    return rows.map(mapDbLocation);
  } catch {
    return localLocations.slice(0, limit);
  }
}

// ─── Public: Related locations ────────────────────────────────────────────────

export async function getRelatedLocations(
  locationId: string,
  category: string,
  region: string,
  limit = 3
): Promise<Location[]> {
  if (!isDbConfigured()) {
    return localLocations
      .filter(
        (l) =>
          l.id !== locationId &&
          (l.category === category || l.region === region)
      )
      .slice(0, limit);
  }
  try {
    const catRow = await prisma.category.findUnique({ where: { slug: category } });
    const regRow = await prisma.region.findFirst({ where: { nameEn: region } });

    const rows = await prisma.location.findMany({
      where: {
        isPublished: true,
        id: { not: Number(locationId) },
        OR: [
          catRow ? { categoryId: catRow.id } : {},
          regRow ? { regionId: regRow.id } : {},
        ],
      },
      include: { translations: true, category: true, region: true },
      take: limit,
    });
    return rows.map(mapDbLocation);
  } catch {
    return localLocations
      .filter(
        (l) =>
          l.id !== locationId &&
          (l.category === category || l.region === region)
      )
      .slice(0, limit);
  }
}

// ─── Admin: All locations (including drafts) ──────────────────────────────────

export async function getAllLocationsForAdmin(): Promise<Location[]> {
  return getLocations(false);
}

// ─── Admin: Categories ────────────────────────────────────────────────────────

export interface DbCategory {
  id: number;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameRu: string;
  _count: { locations: number };
}

export async function getCategories(): Promise<DbCategory[]> {
  if (!isDbConfigured()) {
    // Return mock categories derived from local data
    const slugs = [...new Set(localLocations.map((l) => l.category))];
    return slugs.map((slug, i) => ({
      id: i + 1,
      slug,
      nameEn: slug.charAt(0).toUpperCase() + slug.slice(1),
      nameUz: slug,
      nameRu: slug,
      _count: { locations: localLocations.filter((l) => l.category === slug).length },
    }));
  }
  try {
    return await prisma.category.findMany({
      include: { _count: { select: { locations: true } } },
      orderBy: { nameEn: "asc" },
    });
  } catch {
    const slugs = [...new Set(localLocations.map((l) => l.category))];
    return slugs.map((slug, i) => ({
      id: i + 1,
      slug,
      nameEn: slug.charAt(0).toUpperCase() + slug.slice(1),
      nameUz: slug,
      nameRu: slug,
      _count: { locations: localLocations.filter((l) => l.category === slug).length },
    }));
  }
}

// ─── Admin: Regions ───────────────────────────────────────────────────────────

export interface DbRegion {
  id: number;
  slug: string;
  nameEn: string;
  nameUz: string;
  nameRu: string;
  _count: { locations: number };
}

export async function getRegions(): Promise<DbRegion[]> {
  if (!isDbConfigured()) {
    const names = [...new Set(localLocations.map((l) => l.region))];
    return names.map((name, i) => ({
      id: i + 1,
      slug: name.toLowerCase(),
      nameEn: name,
      nameUz: name,
      nameRu: name,
      _count: { locations: localLocations.filter((l) => l.region === name).length },
    }));
  }
  try {
    return await prisma.region.findMany({
      include: { _count: { select: { locations: true } } },
      orderBy: { nameEn: "asc" },
    });
  } catch {
    const names = [...new Set(localLocations.map((l) => l.region))];
    return names.map((name, i) => ({
      id: i + 1,
      slug: name.toLowerCase(),
      nameEn: name,
      nameUz: name,
      nameRu: name,
      _count: { locations: localLocations.filter((l) => l.region === name).length },
    }));
  }
}

// ─── Site config (singleton id=1) ────────────────────────────────────────────

export interface SiteConfig {
  heroImageUrl: string;
}

const DEFAULT_HERO = "/images/locations/registan-square/cover.jpg";

export async function getSiteConfig(): Promise<SiteConfig> {
  if (!isDbConfigured()) return { heroImageUrl: DEFAULT_HERO };
  try {
    // Use $queryRaw so this works even if the Prisma model delegate is stale
    // (the table is always present once db push has run).
    const rows = await prisma.$queryRaw<Array<{ heroImageUrl: string }>>`
      SELECT "heroImageUrl" FROM "SiteConfig" WHERE id = 1 LIMIT 1
    `;
    return { heroImageUrl: rows[0]?.heroImageUrl || DEFAULT_HERO };
  } catch {
    return { heroImageUrl: DEFAULT_HERO };
  }
}

// ─── Admin: Dashboard stats ───────────────────────────────────────────────────

export interface DashboardStats {
  totalLocations: number;
  publishedLocations: number;
  totalCategories: number;
  totalRegions: number;
  usingDatabase: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isDbConfigured()) {
    return {
      totalLocations: localLocations.length,
      publishedLocations: localLocations.length,
      totalCategories: new Set(localLocations.map((l) => l.category)).size,
      totalRegions: new Set(localLocations.map((l) => l.region)).size,
      usingDatabase: false,
    };
  }
  try {
    const [total, published, categories, regions] = await Promise.all([
      prisma.location.count(),
      prisma.location.count({ where: { isPublished: true } }),
      prisma.category.count(),
      prisma.region.count(),
    ]);
    return {
      totalLocations: total,
      publishedLocations: published,
      totalCategories: categories,
      totalRegions: regions,
      usingDatabase: true,
    };
  } catch {
    return {
      totalLocations: localLocations.length,
      publishedLocations: localLocations.length,
      totalCategories: new Set(localLocations.map((l) => l.category)).size,
      totalRegions: new Set(localLocations.map((l) => l.region)).size,
      usingDatabase: false,
    };
  }
}
