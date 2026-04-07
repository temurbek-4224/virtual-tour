"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/images/placeholder.svg";

interface LocationImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Renders a location image with automatic placeholder fallback.
 * Accepts both local paths (/images/...) and remote URLs (https://...).
 * Falls back to /images/placeholder.svg when src is empty or fails to load.
 */
export default function LocationImage({
  src,
  alt,
  className,
  loading = "lazy",
}: LocationImageProps) {
  // Treat empty/whitespace src as immediately failed — skip broken-image flicker
  const initialSrc = src?.trim() ? src.trim() : PLACEHOLDER;
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [failed, setFailed] = useState(!src?.trim());

  function handleError() {
    if (!failed) {
      setFailed(true);
      setImgSrc(PLACEHOLDER);
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      loading={loading}
      onError={handleError}
    />
  );
}
