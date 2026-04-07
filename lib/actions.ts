"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Server Actions — Location CRUD + Site Config
// These run on the server and interact with the Neon PostgreSQL database.
// If the database is not configured, they return an error prompting setup.
// ─────────────────────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import type { LocationFormData } from "./admin-types";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: admin role required.");
  }
}

// ─── DB connection guard ──────────────────────────────────────────────────────

function assertDbConfigured() {
  const url = process.env.DATABASE_URL ?? "";
  if (
    !url ||
    url.includes("USER:PASSWORD") ||
    url.includes("PLACEHOLDER") ||
    !url.startsWith("postgresql")
  ) {
    throw new Error(
      "DATABASE_URL is not configured. Paste your Neon connection string into .env and restart the server."
    );
  }
}

// ─── Helper: resolve or create category ──────────────────────────────────────

async function resolveCategory(slug: string): Promise<number> {
  let cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) {
    const label = slug.charAt(0).toUpperCase() + slug.slice(1);
    cat = await prisma.category.create({
      data: { slug, nameEn: label, nameUz: label, nameRu: label },
    });
  }
  return cat.id;
}

// ─── Helper: resolve or create region ────────────────────────────────────────

async function resolveRegion(name: string): Promise<number> {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  let reg = await prisma.region.findUnique({ where: { slug } });
  if (!reg) {
    reg = await prisma.region.create({
      data: { slug, nameEn: name, nameUz: name, nameRu: name },
    });
  }
  return reg.id;
}

// ─── Helper: build translation upsert list ────────────────────────────────────

function buildTranslations(data: LocationFormData) {
  const locales = ["en", "uz", "ru"] as const;
  return locales.map((locale) => ({
    locale,
    name: data.translations[locale].name,
    shortDescription: data.translations[locale].shortDescription,
    fullDescription: data.translations[locale].fullDescription,
  }));
}

// ─── Action: Create Location ──────────────────────────────────────────────────

export async function createLocation(
  data: LocationFormData
): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    await assertAdmin();
    assertDbConfigured();

    if (!data.slug.trim()) return { success: false, error: "Slug is required." };
    if (!data.translations.en.name.trim())
      return { success: false, error: "English name is required." };

    const [categoryId, regionId] = await Promise.all([
      resolveCategory(data.category),
      resolveRegion(data.region),
    ]);

    const translations = buildTranslations(data);

    await prisma.location.create({
      data: {
        slug: data.slug.trim().toLowerCase(),
        categoryId,
        regionId,
        latitude: parseFloat(data.lat) || 0,
        longitude: parseFloat(data.lng) || 0,
        coverImage: data.coverImage.trim(),
        galleryImages: data.images.filter((img) => img.trim()),
        youtubeUrl: data.youtubeUrl.trim(),
        youtubeVrUrl: data.youtubeVrUrl.trim(),
        didYouKnowEn: data.didYouKnow.en,
        didYouKnowUz: data.didYouKnow.uz,
        didYouKnowRu: data.didYouKnow.ru,
        tags: data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished: data.isPublished,
        translations: {
          create: translations,
        },
      },
    });

    // Write map URL columns via raw SQL (columns added after last prisma generate)
    const slug = data.slug.trim().toLowerCase();
    await prisma.$executeRaw`
      UPDATE "Location"
      SET "googleMapsUrl" = ${data.googleMapsUrl.trim()},
          "yandexMapsUrl" = ${data.yandexMapsUrl.trim()},
          "directionsUrl" = ${data.directionsUrl.trim()}
      WHERE slug = ${slug}
    `;

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/admin/locations");

    return { success: true, slug: data.slug };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Unique slug constraint
    if (message.includes("Unique constraint")) {
      return { success: false, error: `A location with slug "${data.slug}" already exists.` };
    }
    return { success: false, error: message };
  }
}

// ─── Action: Update Location ──────────────────────────────────────────────────

export async function updateLocation(
  slug: string,
  data: LocationFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    assertDbConfigured();

    const existing = await prisma.location.findUnique({ where: { slug } });
    if (!existing) return { success: false, error: `Location "${slug}" not found in database.` };

    const [categoryId, regionId] = await Promise.all([
      resolveCategory(data.category),
      resolveRegion(data.region),
    ]);

    const translations = buildTranslations(data);

    await prisma.location.update({
      where: { slug },
      data: {
        categoryId,
        regionId,
        latitude: parseFloat(data.lat) || 0,
        longitude: parseFloat(data.lng) || 0,
        coverImage: data.coverImage.trim(),
        galleryImages: data.images.filter((img) => img.trim()),
        youtubeUrl: data.youtubeUrl.trim(),
        youtubeVrUrl: data.youtubeVrUrl.trim(),
        didYouKnowEn: data.didYouKnow.en,
        didYouKnowUz: data.didYouKnow.uz,
        didYouKnowRu: data.didYouKnow.ru,
        tags: data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished: data.isPublished,
        translations: {
          upsert: translations.map((tr) => ({
            where: { locationId_locale: { locationId: existing.id, locale: tr.locale } },
            update: {
              name: tr.name,
              shortDescription: tr.shortDescription,
              fullDescription: tr.fullDescription,
            },
            create: {
              locale: tr.locale,
              name: tr.name,
              shortDescription: tr.shortDescription,
              fullDescription: tr.fullDescription,
            },
          })),
        },
      },
    });

    // Write map URL columns via raw SQL (columns added after last prisma generate)
    await prisma.$executeRaw`
      UPDATE "Location"
      SET "googleMapsUrl" = ${data.googleMapsUrl.trim()},
          "yandexMapsUrl" = ${data.yandexMapsUrl.trim()},
          "directionsUrl" = ${data.directionsUrl.trim()}
      WHERE slug = ${slug}
    `;

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/location/${slug}`);
    revalidatePath("/admin/locations");

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// ─── Action: Save Site Config ─────────────────────────────────────────────────

export async function saveSiteConfig(data: {
  heroImageUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    assertDbConfigured();

    // Use $executeRaw so this works even if the Prisma model delegate is stale.
    // PostgreSQL upsert: insert row 1, or update it if it already exists.
    const heroImageUrl = data.heroImageUrl.trim();
    await prisma.$executeRaw`
      INSERT INTO "SiteConfig" (id, "heroImageUrl", "updatedAt")
      VALUES (1, ${heroImageUrl}, NOW())
      ON CONFLICT (id) DO UPDATE
        SET "heroImageUrl" = EXCLUDED."heroImageUrl",
            "updatedAt"    = NOW()
    `;

    // Revalidate all locale homepages so the new image shows immediately
    revalidatePath("/en");
    revalidatePath("/uz");
    revalidatePath("/ru");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
