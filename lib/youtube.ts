// ─────────────────────────────────────────────────────────────────────────────
// YouTube URL utilities
//
// Converts any user-entered YouTube link into a safe embeddable URL.
// Handles every common format without throwing on bad input.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the 11-character YouTube video ID from any of these formats:
 *
 *   https://www.youtube.com/watch?v=VIDEO_ID          ← standard watch link
 *   https://youtu.be/VIDEO_ID                         ← short share link
 *   https://www.youtube.com/embed/VIDEO_ID            ← already an embed URL
 *   https://www.youtube.com/shorts/VIDEO_ID           ← Shorts link
 *   https://youtube.com/watch?v=VIDEO_ID&t=30s        ← with extra params
 *
 * Returns null if the string is empty, not a URL, or not a YouTube link.
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const raw = url.trim();
  if (!raw) return null;

  // Ordered from most-common to least-common format.
  const patterns: RegExp[] = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,       // …watch?v=ID  or  …&v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,  // youtu.be/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/,    // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/,   // /shorts/ID
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * Converts any valid YouTube URL to a clean embed URL ready for an <iframe>.
 *
 * Options applied by default:
 *   rel=0             — only suggest related videos from the same channel
 *   modestbranding=1  — smaller YouTube logo in the player
 *
 * Returns null for empty strings or unrecognised URLs — callers should
 * use this as a guard to decide whether to render the player at all.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}
