"use client";

import { useState } from "react";
import { saveSiteConfig } from "@/lib/actions";
import { ImageIcon, Save, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

const FALLBACK = "/images/locations/registan-square/cover.jpg";

interface Props {
  initialHeroImageUrl: string;
}

export default function HeroSettingsForm({ initialHeroImageUrl }: Props) {
  const [url, setUrl] = useState(initialHeroImageUrl === FALLBACK ? "" : initialHeroImageUrl);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Preview the image in the card
  const previewUrl = url.trim() || FALLBACK;

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const result = await saveSiteConfig({ heroImageUrl: url.trim() });
      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Failed to save.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Unexpected error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setUrl("");
    setStatus("idle");
  }

  return (
    <div className="space-y-6">
      {/* Image URL input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Hero Background Image URL
        </label>
        <p className="text-xs text-gray-400 leading-relaxed">
          Paste a full image URL starting with <code className="bg-gray-100 px-1 rounded text-gray-600">https://</code>.
          Leave empty to use the built-in default (Registan Square).
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setStatus("idle");
              }}
              placeholder="https://example.com/your-image.jpg"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open image in new tab"
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Preview</p>
        <div
          className="relative h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${previewUrl}')` }}
        >
          {/* Gradient overlay — same as the real hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <p className="text-base font-bold drop-shadow">Discover the Beauty of Uzbekistan</p>
            <p className="text-xs text-white/70 mt-1">← preview of the homepage hero</p>
          </div>
          {/* Reset button */}
          {url && (
            <button
              onClick={handleReset}
              title="Reset to default image"
              className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 hover:bg-black/60 text-white text-xs px-2 py-1 rounded-md transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
        {!url && (
          <p className="text-xs text-gray-400">
            Showing the <strong>default</strong> fallback image (Registan Square).
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
        <p className="text-xs font-semibold text-blue-700">Tips for best results</p>
        <ul className="text-xs text-blue-600 space-y-0.5 list-disc list-inside">
          <li>Use a high-resolution image (at least 1920×1080)</li>
          <li>Landscape orientation works best for the hero section</li>
          <li>Images from Unsplash, Pexels, or Wikimedia Commons work great</li>
          <li>The dark gradient overlay is always applied for text readability</li>
        </ul>
      </div>

      {/* Status messages */}
      {status === "success" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Hero image saved! The homepage will update automatically.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
