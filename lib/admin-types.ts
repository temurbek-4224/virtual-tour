import type { Location } from "./data";

// ─── Form Data ────────────────────────────────────────────────────────────────
// Mirrors the Location interface but uses strings for number fields so they
// work naturally inside HTML form inputs. Convert to proper types on save.

export interface TranslationFields {
  name: string;
  shortDescription: string;
  fullDescription: string;
}

export interface LocationFormData {
  // Identity
  slug: string;
  // Classification
  category: string;
  region: string;
  // Coordinates (strings for inputs)
  lat: string;
  lng: string;
  // Publish state
  isPublished: boolean;
  // Images
  coverImage: string;
  images: string[]; // local paths, e.g. /images/locations/[slug]/gallery-1.jpg
  // Media
  youtubeUrl: string;
  youtubeVrUrl: string;
  // Map links (direct URLs — used on the public page instead of coordinates)
  googleMapsUrl: string;
  yandexMapsUrl: string;
  directionsUrl: string;
  // Tags (comma-separated string for easy editing)
  tags: string;
  // Did You Know facts (one per locale)
  didYouKnow: {
    en: string;
    uz: string;
    ru: string;
  };
  // Translations per locale
  translations: {
    en: TranslationFields;
    uz: TranslationFields;
    ru: TranslationFields;
  };
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const emptyTranslation: TranslationFields = {
  name: "",
  shortDescription: "",
  fullDescription: "",
};

export const EMPTY_FORM: LocationFormData = {
  slug: "",
  category: "historical",
  region: "",
  lat: "",
  lng: "",
  isPublished: false,
  coverImage: "",
  images: [""],
  youtubeUrl: "",
  youtubeVrUrl: "",
  googleMapsUrl: "",
  yandexMapsUrl: "",
  directionsUrl: "",
  tags: "",
  didYouKnow: { en: "", uz: "", ru: "" },
  translations: {
    en: { ...emptyTranslation },
    uz: { ...emptyTranslation },
    ru: { ...emptyTranslation },
  },
};

// ─── Converter: Location → LocationFormData (for pre-filling edit form) ──────

export function locationToFormData(loc: Location): LocationFormData {
  return {
    slug: loc.slug,
    category: loc.category,
    region: loc.region,
    lat: String(loc.lat),
    lng: String(loc.lng),
    isPublished: true, // existing data is treated as published
    coverImage: loc.coverImage,
    images: loc.images.length > 0 ? loc.images : [""],
    youtubeUrl: loc.youtubeUrl,
    youtubeVrUrl: loc.youtubeVrUrl,
    googleMapsUrl: loc.googleMapsUrl ?? "",
    yandexMapsUrl: loc.yandexMapsUrl ?? "",
    directionsUrl: loc.directionsUrl ?? "",
    tags: loc.tags.join(", "),
    didYouKnow: {
      en: loc.didYouKnow.en,
      uz: loc.didYouKnow.uz,
      ru: loc.didYouKnow.ru,
    },
    translations: {
      en: { ...loc.translations.en },
      uz: { ...loc.translations.uz },
      ru: { ...loc.translations.ru },
    },
  };
}

// ─── Table row shape ──────────────────────────────────────────────────────────

export interface LocationRow {
  id: string;
  slug: string;
  name: string; // English name for the table
  category: string;
  region: string;
  isPublished: boolean;
  imageCount: number;
}

export function locationToRow(loc: Location): LocationRow {
  return {
    id: loc.id,
    slug: loc.slug,
    name: loc.translations.en.name,
    category: loc.category,
    region: loc.region,
    isPublished: true,
    imageCount: loc.images.length,
  };
}
