"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Info,
  Globe,
  Image as ImageIcon,
  MapPin,
  PlayCircle,
  Lightbulb,
  FileText,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationFormData } from "@/lib/admin-types";
import { ALL_CATEGORIES } from "@/lib/data";
import { createLocation, updateLocation } from "@/lib/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "uz" | "ru";
type Mode = "new" | "edit";

interface LocationFormProps {
  initialData: LocationFormData;
  mode: Mode;
  locationId?: string;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <Icon className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-9 px-3 rounded-lg border border-gray-200 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        "placeholder:text-gray-300 bg-white",
        readOnly && "bg-gray-50 text-gray-500 cursor-default",
        className
      )}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        "placeholder:text-gray-300 bg-white"
      )}
    />
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-sm shadow-2xl animate-fade-in max-w-md w-full mx-4",
        type === "success"
          ? "bg-green-800 text-white"
          : "bg-red-700 text-white"
      )}
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 text-green-300 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-300 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-white/60 hover:text-white text-xs shrink-0">
        Dismiss
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LocationForm({ initialData, mode }: LocationFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.match(/^\/(en|uz|ru)/)?.[1] ?? "en";

  const [data, setData] = useState<LocationFormData>(initialData);
  const [activeTab, setActiveTab] = useState<Lang>("en");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Field updaters ──────────────────────────────────────────────────────

  function setField<K extends keyof LocationFormData>(key: K, value: LocationFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function setTranslation(lang: Lang, field: keyof LocationFormData["translations"]["en"], value: string) {
    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: { ...prev.translations[lang], [field]: value },
      },
    }));
  }

  function setDidYouKnow(lang: Lang, value: string) {
    setData((prev) => ({
      ...prev,
      didYouKnow: { ...prev.didYouKnow, [lang]: value },
    }));
  }

  // ─── Gallery image array helpers ─────────────────────────────────────────

  function addImage() {
    setData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function updateImage(index: number, value: string) {
    const next = [...data.images];
    next[index] = value;
    setData((prev) => ({ ...prev, images: next }));
  }

  function removeImage(index: number) {
    if (data.images.length <= 1) return;
    setData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  // ─── Real save via server action ─────────────────────────────────────────

  async function handleSave() {
    if (!data.slug.trim()) {
      setToast({ message: "Slug is required.", type: "error" });
      return;
    }
    if (!data.translations.en.name.trim()) {
      setToast({ message: "English name is required.", type: "error" });
      return;
    }

    setIsSaving(true);

    try {
      if (mode === "new") {
        const result = await createLocation(data);
        if (result.success) {
          setToast({ message: `Location "${data.translations.en.name}" created successfully!`, type: "success" });
          setTimeout(() => router.push(`/${locale}/admin/locations`), 1200);
        } else {
          setToast({ message: result.error ?? "Failed to create location.", type: "error" });
        }
      } else {
        const result = await updateLocation(data.slug, data);
        if (result.success) {
          setToast({ message: `"${data.translations.en.name}" saved successfully!`, type: "success" });
        } else {
          setToast({ message: result.error ?? "Failed to save location.", type: "error" });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  // ─── Lang tab config ─────────────────────────────────────────────────────

  const LANG_TABS: { key: Lang; label: string; flag: string }[] = [
    { key: "en", label: "English", flag: "🇬🇧" },
    { key: "uz", label: "O'zbek", flag: "🇺🇿" },
    { key: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* ── DB notice banner ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
        <span>
          {mode === "new" ? (
            <>
              <strong>Create mode:</strong> Fill in the form and click &ldquo;Create Location&rdquo;.
              If Neon is connected, data persists to the database. Otherwise, set up your .env first.
            </>
          ) : (
            <>
              <strong>Edit mode:</strong> Changes are saved to the Neon database when you click
              &ldquo;Save Changes&rdquo;. Slug cannot be changed after creation.
            </>
          )}
        </span>
      </div>

      {/* ── 1. Basic Info ── */}
      <FormSection title="Basic Information" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label required>Slug (URL identifier)</Label>
            <Input
              value={data.slug}
              onChange={(v) => setField("slug", v.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. registan-square"
              readOnly={mode === "edit"}
            />
            {mode === "edit" && (
              <p className="text-[11px] text-gray-400 mt-1">Slug cannot be changed after creation.</p>
            )}
          </div>

          <div>
            <Label required>Category</Label>
            <select
              value={data.category}
              onChange={(e) => setField("category", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Region / City</Label>
            <Input
              value={data.region}
              onChange={(v) => setField("region", v)}
              placeholder="e.g. Samarkand"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField("isPublished", !data.isPublished)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
              data.isPublished ? "bg-green-500" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                data.isPublished ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {data.isPublished ? "Published — visible on public site" : "Draft — hidden from public site"}
          </span>
        </div>
      </FormSection>

      {/* ── 2. Coordinates ── */}
      <FormSection title="Coordinates" icon={MapPin}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input
              value={data.lat}
              onChange={(v) => setField("lat", v)}
              placeholder="e.g. 39.6547"
              type="text"
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={data.lng}
              onChange={(v) => setField("lng", v)}
              placeholder="e.g. 66.9758"
              type="text"
            />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Tip: Right-click any location on Google Maps → &ldquo;What&apos;s here?&rdquo; to copy the coordinates.
        </p>
      </FormSection>

      {/* ── 3. Map Links ── */}
      <FormSection title="Map Links" icon={LinkIcon}>
        {/* Helper tip */}
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-[11px] text-blue-700 leading-relaxed">
          <strong>How to get these links:</strong> Open the location in Google Maps or Yandex Maps
          in your browser, then copy the full URL from the address bar and paste it below.
          These links are used directly on the public location page for the action buttons.
          If a field is left empty, the page falls back to the saved coordinates above.
        </div>

        <div className="space-y-4">
          <div>
            <Label>Google Maps URL</Label>
            <Input
              value={data.googleMapsUrl}
              onChange={(v) => setField("googleMapsUrl", v)}
              placeholder="https://maps.google.com/?q=Registan+Square+Samarkand"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used for the &ldquo;Open in Google Maps&rdquo; button. Leave empty to auto-generate from coordinates.
            </p>
          </div>

          <div>
            <Label>Yandex Maps URL</Label>
            <Input
              value={data.yandexMapsUrl}
              onChange={(v) => setField("yandexMapsUrl", v)}
              placeholder="https://yandex.com/maps/?ll=66.9758,39.6547&z=16"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used for the &ldquo;Open in Yandex Maps&rdquo; button. Leave empty to auto-generate from coordinates.
            </p>
          </div>

          <div>
            <Label>Directions URL <span className="text-gray-300 font-normal normal-case">(optional)</span></Label>
            <Input
              value={data.directionsUrl}
              onChange={(v) => setField("directionsUrl", v)}
              placeholder="https://maps.google.com/maps/dir/?api=1&destination=39.6547,66.9758"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used for the &ldquo;Get Directions&rdquo; button. Leave empty to auto-generate from coordinates.
            </p>
          </div>
        </div>
      </FormSection>

      {/* ── 4. Images ── */}
      <FormSection title="Images" icon={ImageIcon}>

        {/* Format guide */}
        <div className="mb-5 grid sm:grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
            <p className="font-semibold text-slate-600 mb-1">📁 Local file path</p>
            <code className="text-slate-500 break-all">/images/locations/registan-square/cover.jpg</code>
            <p className="text-slate-400 mt-1">Place the file in <code>public/</code> and use a path starting with <code>/</code>.</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
            <p className="font-semibold text-slate-600 mb-1">🌐 Remote URL</p>
            <code className="text-slate-500 break-all">https://upload.wikimedia.org/…/image.jpg</code>
            <p className="text-slate-400 mt-1">Paste any full <code>https://</code> URL. Wikimedia, Imgur, Google Photos all work.</p>
          </div>
        </div>

        {/* Cover image */}
        <div className="mb-5">
          <Label>Cover Image</Label>
          <div className="flex gap-3 items-start">
            {/* Thumbnail preview */}
            <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {data.coverImage.trim() ? (
                <img
                  src={data.coverImage.trim()}
                  alt="cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.svg";
                  }}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <Input
                value={data.coverImage}
                onChange={(v) => setField("coverImage", v)}
                placeholder="/images/locations/[slug]/cover.jpg  or  https://..."
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Shown as the main hero image on the detail page and on cards.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery images */}
        <div>
          <Label>Gallery Images</Label>
          <div className="space-y-2">
            {data.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Tiny thumbnail */}
                <div className="shrink-0 w-8 h-8 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {img.trim() ? (
                    <img
                      src={img.trim()}
                      alt={`gallery ${idx + 1} preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.svg";
                      }}
                    />
                  ) : (
                    <span className="text-[9px] text-gray-300 font-bold">{idx + 1}</span>
                  )}
                </div>
                <Input
                  value={img}
                  onChange={(v) => updateImage(idx, v)}
                  placeholder={`/images/locations/[slug]/gallery-${idx + 1}.jpg  or  https://...`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  disabled={data.images.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addImage}
            className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add gallery image
          </button>
        </div>
      </FormSection>

      {/* ── 5. Media (YouTube) ── */}
      <FormSection title="Video Links" icon={PlayCircle}>
        <div className="space-y-4">
          <div>
            <Label>Standard YouTube Video URL</Label>
            <Input
              value={data.youtubeUrl}
              onChange={(v) => setField("youtubeUrl", v)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <Label>360° VR YouTube Video URL</Label>
            <Input
              value={data.youtubeVrUrl}
              onChange={(v) => setField("youtubeVrUrl", v)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Search YouTube for &ldquo;360 [location name]&rdquo; to find VR-compatible videos.
            </p>
          </div>
        </div>
      </FormSection>

      {/* ── 6. Did You Know ── */}
      <FormSection title="Did You Know? Facts" icon={Lightbulb}>
        <div className="space-y-4">
          {LANG_TABS.map(({ key, label, flag }) => (
            <div key={key}>
              <Label>
                {flag} {label}
              </Label>
              <Textarea
                value={data.didYouKnow[key]}
                onChange={(v) => setDidYouKnow(key, v)}
                placeholder={`Write an interesting fact in ${label}...`}
                rows={2}
              />
            </div>
          ))}
        </div>
      </FormSection>

      {/* ── 7. Tags ── */}
      <FormSection title="Tags" icon={Info}>
        <Label>Tags (comma-separated)</Label>
        <Input
          value={data.tags}
          onChange={(v) => setField("tags", v)}
          placeholder="UNESCO, Timurid, Architecture, Medieval"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          Used for search and filtering. Separate with commas.
        </p>
      </FormSection>

      {/* ── 8. Translations ── */}
      <FormSection title="Translations" icon={Globe}>
        {/* Language tabs */}
        <div className="flex border-b border-gray-200 mb-5 -mx-5 px-5 gap-1">
          {LANG_TABS.map(({ key, label, flag }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <span>{flag}</span>
              {label}
              {/* Completion indicator */}
              <span
                className={cn(
                  "ml-1 h-1.5 w-1.5 rounded-full",
                  data.translations[key].name
                    ? "bg-green-400"
                    : "bg-gray-200"
                )}
              />
            </button>
          ))}
        </div>

        {/* Tab content */}
        {LANG_TABS.map(({ key, label, flag }) => (
          <div key={key} className={activeTab === key ? "space-y-4" : "hidden"}>
            <div className="flex items-center gap-2 mb-1">
              <span>{flag}</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label} Translation
              </span>
            </div>

            <div>
              <Label required>Name</Label>
              <Input
                value={data.translations[key].name}
                onChange={(v) => setTranslation(key, "name", v)}
                placeholder={`Location name in ${label}`}
              />
            </div>

            <div>
              <Label required>Short Description</Label>
              <Textarea
                value={data.translations[key].shortDescription}
                onChange={(v) => setTranslation(key, "shortDescription", v)}
                placeholder={`One or two sentence summary in ${label}...`}
                rows={2}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Shown on cards and at the top of the detail page.
              </p>
            </div>

            <div>
              <Label required>Full Description</Label>
              <Textarea
                value={data.translations[key].fullDescription}
                onChange={(v) => setTranslation(key, "fullDescription", v)}
                placeholder={`Detailed description in ${label}. Use two newlines to create paragraphs.`}
                rows={8}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Separate paragraphs with a blank line (double Enter).
              </p>
            </div>
          </div>
        ))}
      </FormSection>

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 sticky bottom-0 bg-gray-50 py-4 -mx-6 px-6 mt-2">
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/locations`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400 hidden sm:block">
            {mode === "new" ? "Will be saved to Neon database" : "Changes saved to Neon database"}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all",
              isSaving
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary/90 shadow-sm hover:shadow-md"
            )}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : mode === "new" ? "Create Location" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
