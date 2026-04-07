"use client";

import { useEffect } from "react";

/**
 * Sets document.documentElement.lang so the <html> lang attribute stays
 * accurate per locale even though <html> lives in the root layout.
 */
export default function LangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
