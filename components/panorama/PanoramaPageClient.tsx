"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Globe, Info, MousePointer2 } from "lucide-react";
import type { PanoramaItem } from "@/lib/panorama-data";
import Image from "next/image";

// Load PanoramaViewer on the client only — Pannellum uses browser APIs.
const PanoramaViewer = dynamic(() => import("@/components/PanoramaViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="flex flex-col items-center justify-center bg-slate-900 rounded-2xl shadow-xl"
      style={{ height: "560px" }}
    >
      <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
      <p className="text-white/50 text-sm">360° panorama yuklanmoqda…</p>
    </div>
  ),
});

interface Props {
  panoramas: PanoramaItem[];
  title: string;
  subtitle: string;
  description: string;
  selectLabel: string;
  formatNote: string;
}

export default function PanoramaPageClient({
  panoramas,
  title,
  subtitle,
  description,
  selectLabel,
  formatNote,
}: Props) {
  const [selected, setSelected] = useState<PanoramaItem>(panoramas[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero header ───────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Globe className="h-3.5 w-3.5" />
            <span>360° Equirectangular Panorama</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">

        {/* ── Viewer header row ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xl font-semibold">{selected.title}</h2>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MousePointer2 className="h-3.5 w-3.5" />
            Rasmni sichqoncha yoki barmoq bilan aylantiring
          </span>
        </div>

        {/* ── Main Pannellum viewer ──────────────────────────────── */}
        {/* key= forces a clean remount when the selected image changes */}
        <PanoramaViewer
          key={selected.imageUrl}
          imageUrl={selected.imageUrl}
          title={selected.title}
          height="560px"
        />

        {/* ── Attribution ───────────────────────────────────────── */}
        {selected.attribution && (
          <p className="mt-3 text-xs text-muted-foreground text-right">
            {selected.attribution}
          </p>
        )}

        {/* ── Format note ───────────────────────────────────────── */}
        <div className="flex items-start gap-2.5 mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {formatNote}
          </p>
        </div>

        {/* ── Description ───────────────────────────────────────── */}
        <div className="bg-muted/40 rounded-2xl p-6 mt-6 mb-10 border border-border">
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {description}
          </p>
        </div>

        {/* ── Thumbnail grid ────────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold mb-5">{selectLabel}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {panoramas.map((pano) => (
              <button
                key={pano.id}
                onClick={() => setSelected(pano)}
                className={[
                  "group relative rounded-xl overflow-hidden aspect-video cursor-pointer",
                  "transition-all duration-200 focus:outline-none",
                  selected.id === pano.id
                    ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                    : "hover:ring-2 hover:ring-primary/40 hover:ring-offset-1 hover:shadow-md",
                ].join(" ")}
              >
                <Image
                  src={pano.imageUrl}
                  alt={pano.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  loading="lazy"
                  unoptimized
                />
                {/* Hover / active overlay */}
                <div
                  className={[
                    "absolute inset-0 transition-colors duration-200",
                    selected.id === pano.id
                      ? "bg-primary/20"
                      : "bg-transparent group-hover:bg-black/10",
                  ].join(" ")}
                />
                {/* Title strip */}
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-white text-xs font-medium line-clamp-1">
                    {pano.title}
                  </span>
                </div>
                {/* Active indicator */}
                {selected.id === pano.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0
                           01-1.414 0l-4-4a1 1 0 011.414-1.414L8
                           12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
