'use client';

import { useEffect, useRef, useState } from 'react';
import 'pannellum/build/pannellum.css';

export interface PanoramaViewerProps {
  imageUrl: string;
  title?: string;
  height?: string;
  haov?: number;
  vaov?: number;
  vOffset?: number;
}

export function PanoramaViewer({
  imageUrl,
  title,
  height = '500px',
  haov = 140,
  vaov = 55,
  vOffset = 0,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const destroyViewer = () => {
      if (viewerRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (viewerRef.current as any).destroy();
        } catch {
          // ignore
        }
        viewerRef.current = null;
      }
    };

    const initViewer = async () => {
      setIsLoading(true);
      setHasError(false);
      destroyViewer();

      try {
        // Pannellum is a UMD bundle that attaches to window.pannellum.
        // @types/pannellum uses global namespace declarations (not ES module),
        // so we load it via a dynamic import and read from window.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — @types/pannellum is a global-namespace package, not a module
        await import('pannellum');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pannellum = (window as any).pannellum;

        if (cancelled || !containerRef.current || !pannellum) return;

        viewerRef.current = pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: imageUrl,
          title: title ?? '',
          autoLoad: true,
          mouseZoom: true,
          touchPanSpeedCoefficient: 1,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          // Partial panorama settings — adjust these per image if it looks stretched
          haov,   // horizontal angle of view of the image (degrees, max 360)
          vaov,   // vertical angle of view of the image (degrees, max 180)
          vOffset, // vertical offset of the panorama center (degrees)
          friction: 0.15,
        }) as ReturnType<typeof setTimeout>;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (viewerRef.current as any).on('load', () => {
          if (!cancelled) setIsLoading(false);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (viewerRef.current as any).on('error', () => {
          if (!cancelled) {
            setIsLoading(false);
            setHasError(true);
          }
        });
      } catch {
        if (!cancelled) {
          setIsLoading(false);
          setHasError(true);
        }
      }
    };

    initViewer();

    return () => {
      cancelled = true;
      destroyViewer();
    };
  }, [imageUrl, title, haov, vaov, vOffset]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[#050b1f] border border-blue-900/30"
      style={{ height }}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#050b1f]">
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-blue-300/60 text-sm font-medium">Loading panorama…</span>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#050b1f] text-center px-6">
          <span className="text-5xl">🌐</span>
          <p className="text-red-400/70 text-sm font-medium">Failed to load panorama image.</p>
          <p className="text-blue-300/40 text-xs">Check that the image path is correct.</p>
        </div>
      )}

      {/* Pannellum mounts here */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
