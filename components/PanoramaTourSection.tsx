'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Camera, Move } from 'lucide-react';
import type { PanoramaViewerProps } from './PanoramaViewer';

// Load the viewer with SSR disabled — pannellum needs WebGL / DOM
const PanoramaViewer = dynamic(
  () => import('./PanoramaViewer').then((m) => ({ default: m.PanoramaViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center bg-[#050b1f] border border-blue-900/30 rounded-2xl" style={{ height: '560px' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-blue-300/60 text-sm font-medium">Loading panorama…</span>
        </div>
      </div>
    ),
  }
);

export interface PanoramaItem {
  id: number;
  title: string;
  imageUrl: string;
  haov: number;
  vaov: number;
  vOffset: number;
}

interface PanoramaTourSectionProps {
  panoramas: PanoramaItem[];
  selectHint: string;
  dragHint: string;
}

export function PanoramaTourSection({ panoramas, selectHint, dragHint }: PanoramaTourSectionProps) {
  const [active, setActive] = useState<PanoramaItem>(panoramas[0]);

  const viewerProps: PanoramaViewerProps = {
    imageUrl: active.imageUrl,
    title: active.title,
    height: '560px',
    haov: active.haov,
    vaov: active.vaov,
    vOffset: active.vOffset,
  };

  return (
    <div className="space-y-6">
      {/* Active panorama title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Camera className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">{active.title}</h3>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-blue-300/50 text-xs font-medium">
          <Move className="w-3.5 h-3.5" />
          {dragHint}
        </div>
      </div>

      {/* Main viewer */}
      <PanoramaViewer {...viewerProps} />

      {/* Mobile drag hint */}
      <p className="sm:hidden text-center text-blue-300/40 text-xs flex items-center justify-center gap-1.5">
        <Move className="w-3.5 h-3.5" />
        {dragHint}
      </p>

      {/* Gallery thumbnails */}
      <div>
        <p className="text-blue-300/50 text-sm font-medium mb-3">{selectHint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {panoramas.map((pano) => {
            const isActive = pano.id === active.id;
            return (
              <button
                key={pano.id}
                onClick={() => setActive(pano)}
                className={`group relative rounded-xl overflow-hidden aspect-video transition-all duration-300 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-[1.02]'
                    : 'border-blue-900/30 hover:border-blue-600/50 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/10'
                }`}
              >
                <Image
                  src={pano.imageUrl}
                  alt={pano.title}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isActive ? 'brightness-100' : 'brightness-60 group-hover:brightness-80'
                  }`}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}

                {/* Panorama number */}
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-white/80 text-[11px] font-medium leading-tight line-clamp-1">
                    {pano.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
