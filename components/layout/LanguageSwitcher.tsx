"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const localeLabels: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  uz: { label: "O'zbek", flag: "🇺🇿" },
  ru: { label: "Русский", flag: "🇷🇺" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLocaleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  }

  const current = localeLabels[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
          "text-foreground/80 hover:text-foreground hover:bg-accent",
          "transition-colors duration-150 border border-transparent hover:border-border"
        )}
        aria-label={t("language")}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current?.flag}</span>
        <span className="hidden md:inline">{current?.label}</span>
        <span className="sm:hidden">{current?.flag}</span>
        <svg
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border bg-popover shadow-lg z-50 overflow-hidden animate-fade-in">
          {routing.locales.map((loc) => {
            const info = localeLabels[loc];
            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors",
                  "hover:bg-accent text-left",
                  loc === locale
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground"
                )}
              >
                <span className="text-base">{info.flag}</span>
                <span>{info.label}</span>
                {loc === locale && (
                  <svg
                    className="ml-auto h-3.5 w-3.5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
