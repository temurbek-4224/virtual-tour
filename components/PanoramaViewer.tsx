"use client";

/**
 * PanoramaViewer
 * ──────────────
 * Loads Pannellum as a plain browser <script> tag (window.pannellum).
 *
 * Why script tag instead of import()?
 *   The pannellum npm build has NO module.exports.
 *   It only sets window.libpannellum and window.pannellum.
 *   Any dynamic import() or require() throws "window is not defined"
 *   during module evaluation, silently sets hasError=true, and the
 *   viewer never starts.  Loading it as a <script> is the correct
 *   approach for this library.
 */

import { useEffect, useRef, useState } from "react";

// ── helpers ────────────────────────────────────────────────────────────────

/** Inject a <link rel="stylesheet"> once into <head>. */
function injectCSS(href: string) {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[data-pnlm-css]`)) return;
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  el.setAttribute("data-pnlm-css", "1");
  document.head.appendChild(el);
}

/**
 * Inject a <script> and resolve when it loads.
 * If the script was already added, attaches to the existing element.
 * If window.pannellum is already set, resolves immediately.
 */
function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pannellum) {
      resolve();
      return;
    }
    // Tag already in DOM (loading in progress)
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-pnlm-js]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Pannellum script load error")),
        { once: true }
      );
      return;
    }
    // Fresh insert
    const el = document.createElement("script");
    el.src = src;
    el.setAttribute("data-pnlm-js", "1");
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

/** Returns true if the browser supports WebGL. */
function checkWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

// ── component ──────────────────────────────────────────────────────────────

export interface PanoramaViewerProps {
  imageUrl: string;
  title?: string;
  height?: string;
}

export default function PanoramaViewer({
  imageUrl,
  title,
  height = "560px",
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    setIsLoading(true);
    setHasError(false);
    setErrorDetail("");

    console.log("[PanoramaViewer] imageUrl →", imageUrl);

    const fail = (msg: string, raw?: unknown) => {
      console.error("[PanoramaViewer]", msg, raw ?? "");
      if (!cancelled) {
        setIsLoading(false);
        setHasError(true);
        setErrorDetail(msg);
      }
    };

    const initViewer = () => {
      if (cancelled || !containerRef.current) return;

      // ── WebGL check ──────────────────────────────────────────
      if (!checkWebGL()) {
        fail("WebGL brauzeringizda qo'llab-quvvatlanmaydi.");
        return;
      }

      // ── Resolve window.pannellum ─────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pnlm = (window as any).pannellum;
      if (!pnlm || typeof pnlm.viewer !== "function") {
        fail("window.pannellum topilmadi — skriptni yuklashda xatolik.");
        return;
      }

      // ── Destroy previous viewer cleanly ──────────────────────
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch { /* ignore */ }
        viewerRef.current = null;
        containerRef.current.innerHTML = "";
      }

      // ── Create viewer ────────────────────────────────────────
      console.log("[PanoramaViewer] calling pannellum.viewer() …");
      try {
        viewerRef.current = pnlm.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          showControls: true,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          compass: false,
          hfov: 90,
          minHfov: 50,
          maxHfov: 110,
          pitch: 0,
          yaw: 0,
          mouseZoom: true,
          draggable: true,
          keyboardZoom: true,
        });
      } catch (e) {
        fail("pannellum.viewer() xatolik berdi.", e);
        return;
      }

      // ── Event listeners ──────────────────────────────────────
      viewerRef.current.on("load", () => {
        console.log("[PanoramaViewer] ✅ loaded:", imageUrl);
        if (!cancelled) setIsLoading(false);
      });

      viewerRef.current.on("error", (msg: string) => {
        fail(`Pannellum xatosi: ${msg}`);
      });
    };

    // ── Load Pannellum assets then init ──────────────────────────
    (async () => {
      try {
        injectCSS("/lib/pannellum.css");
        await injectScript("/lib/pannellum.js");
        initViewer();
      } catch (e) {
        fail("Pannellum skriptini yuklashda xatolik.", e);
      }
    })();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch { /* ignore */ }
        viewerRef.current = null;
      }
    };
  }, [imageUrl]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900"
      style={{ height }}
    >
      {/* ── Spinner ───────────────────────────────────────── */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 pointer-events-none">
          <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
          <p className="text-white/60 text-sm font-medium">
            360° panorama yuklanmoqda…
          </p>
          {title && (
            <p className="text-white/30 text-xs mt-1">{title}</p>
          )}
        </div>
      )}

      {/* ── Error + image fallback ─────────────────────────── */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 text-center px-6">
          {/* Still show the panorama as a flat image so it's not blank */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title ?? "Panorama"}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            draggable={false}
          />
          <div className="relative z-10">
            <span className="text-4xl mb-3 block">⚠️</span>
            <p className="text-white font-semibold text-sm mb-1">
              360° ko&apos;rinish yuklanmadi
            </p>
            <p className="text-white/50 text-xs max-w-xs leading-relaxed">
              WebGL aktiv bo&apos;lgan brauzer talab etiladi (Chrome, Edge,
              Firefox).
            </p>
            {errorDetail && (
              <p className="mt-3 text-white/30 text-[10px] font-mono break-all max-w-xs">
                {errorDetail}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Rotate hint (after load) ───────────────────────── */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="block bg-black/55 backdrop-blur-sm text-white/80 rounded-full px-5 py-1.5 text-xs whitespace-nowrap select-none">
            Rasmni sichqoncha yoki barmoq bilan aylantiring
          </span>
        </div>
      )}

      {/* ── Pannellum mounts here ──────────────────────────── */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
