// ─────────────────────────────────────────────────────────────────────────────
// 360° panorama data
//
// All images are true 2:1 equirectangular — verified by sharp.
// To rebuild:  npm run optimize:360
//
// Available optimized files:
//   panorama-1.jpg        4096×2048  (~1.5 MB)  ← main 4K version
//   panorama-1-small.jpg  2048×1024  (~0.4 MB)  ← WebGL-safe fallback
//   panorama-2.jpg        1920×960   (~0.5 MB)  ← standard version
// ─────────────────────────────────────────────────────────────────────────────

export interface PanoramaItem {
  id: number;
  title: string;
  /** Path served from /public — must start with /images/360-optimized/ */
  imageUrl: string;
  /** Optional attribution shown below the viewer */
  attribution?: string;
}

export const panoramas: PanoramaItem[] = [
  {
    id: 1,
    // 4096×2048  —  main choice for the Pannellum viewer
    title: "Alameda Central — 4K panorama",
    imageUrl: "/images/360-optimized/panorama-1.jpg",
    attribution:
      "Alameda Central, Mexico City. Manba: Wikimedia Commons. CC BY-SA 4.0.",
  },
  {
    id: 2,
    // 2048×1024  —  lighter alternative if 4K is slow to load
    title: "Alameda Central — Engil versiya",
    imageUrl: "/images/360-optimized/panorama-1-small.jpg",
    attribution:
      "Alameda Central, Mexico City. Manba: Wikimedia Commons. CC BY-SA 4.0.",
  },
  {
    id: 3,
    // 1920×960  —  standard resolution
    title: "Alameda Central — Standart",
    imageUrl: "/images/360-optimized/panorama-2.jpg",
    attribution:
      "Alameda Central, Mexico City. Manba: Wikimedia Commons. CC BY-SA 4.0.",
  },
];
