// ─────────────────────────────────────────────────────────────────────────────
// Prisma Seed Script
// Run: npm run db:seed
// Seeds: categories, regions, and all 10 Uzbekistan locations with translations
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import { locations } from "../lib/data";

const prisma = new PrismaClient();

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: "historical", nameEn: "Historical", nameUz: "Tarixiy", nameRu: "Исторический" },
  { slug: "architecture", nameEn: "Architecture", nameUz: "Me'morchilik", nameRu: "Архитектура" },
  { slug: "museum", nameEn: "Museum", nameUz: "Muzey", nameRu: "Музей" },
  { slug: "bazaar", nameEn: "Bazaar", nameUz: "Bozor", nameRu: "Базар" },
  { slug: "mausoleum", nameEn: "Mausoleum", nameUz: "Maqbara", nameRu: "Мавзолей" },
  { slug: "mosque", nameEn: "Mosque", nameUz: "Masjid", nameRu: "Мечеть" },
  { slug: "nature", nameEn: "Nature", nameUz: "Tabiat", nameRu: "Природа" },
];

// ─── Regions ──────────────────────────────────────────────────────────────────

const REGIONS = [
  { slug: "samarkand", nameEn: "Samarkand", nameUz: "Samarqand", nameRu: "Самарканд" },
  { slug: "bukhara", nameEn: "Bukhara", nameUz: "Buxoro", nameRu: "Бухара" },
  { slug: "tashkent", nameEn: "Tashkent", nameUz: "Toshkent", nameRu: "Ташкент" },
  { slug: "khiva", nameEn: "Khiva", nameUz: "Xiva", nameRu: "Хива" },
];

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting database seed...\n");

  // 1. Seed categories
  console.log("📁 Seeding categories...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`   ✓ ${CATEGORIES.length} categories seeded\n`);

  // 2. Seed regions
  console.log("🗺️  Seeding regions...");
  for (const reg of REGIONS) {
    await prisma.region.upsert({
      where: { slug: reg.slug },
      update: reg,
      create: reg,
    });
  }
  console.log(`   ✓ ${REGIONS.length} regions seeded\n`);

  // 3. Fetch category & region records for ID lookup
  const categories = await prisma.category.findMany();
  const regions = await prisma.region.findMany();

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const regMap = Object.fromEntries(regions.map((r) => [r.nameEn.toLowerCase(), r.id]));

  // 4. Seed locations
  console.log("📍 Seeding locations...");

  for (const loc of locations) {
    const categoryId = catMap[loc.category];
    const regionId = regMap[loc.region.toLowerCase()];

    if (!categoryId) {
      console.warn(`   ⚠ No category found for slug: "${loc.category}" — skipping ${loc.slug}`);
      continue;
    }
    if (!regionId) {
      console.warn(`   ⚠ No region found for name: "${loc.region}" — skipping ${loc.slug}`);
      continue;
    }

    const created = await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {
        categoryId,
        regionId,
        latitude: loc.lat,
        longitude: loc.lng,
        coverImage: loc.coverImage,
        galleryImages: loc.images,
        youtubeUrl: loc.youtubeUrl,
        youtubeVrUrl: loc.youtubeVrUrl,
        didYouKnowEn: loc.didYouKnow.en,
        didYouKnowUz: loc.didYouKnow.uz,
        didYouKnowRu: loc.didYouKnow.ru,
        tags: loc.tags,
        isPublished: true,
      },
      create: {
        slug: loc.slug,
        categoryId,
        regionId,
        latitude: loc.lat,
        longitude: loc.lng,
        coverImage: loc.coverImage,
        galleryImages: loc.images,
        youtubeUrl: loc.youtubeUrl,
        youtubeVrUrl: loc.youtubeVrUrl,
        didYouKnowEn: loc.didYouKnow.en,
        didYouKnowUz: loc.didYouKnow.uz,
        didYouKnowRu: loc.didYouKnow.ru,
        tags: loc.tags,
        isPublished: true,
      },
    });

    // Upsert translations for each locale
    const locales = ["en", "uz", "ru"] as const;
    for (const locale of locales) {
      const tr = loc.translations[locale];
      await prisma.locationTranslation.upsert({
        where: {
          locationId_locale: { locationId: created.id, locale },
        },
        update: {
          name: tr.name,
          shortDescription: tr.shortDescription,
          fullDescription: tr.fullDescription,
        },
        create: {
          locationId: created.id,
          locale,
          name: tr.name,
          shortDescription: tr.shortDescription,
          fullDescription: tr.fullDescription,
        },
      });
    }

    console.log(`   ✓ ${loc.translations.en.name}`);
  }

  console.log(`\n✅ Seed complete! ${locations.length} locations inserted/updated in Neon.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
