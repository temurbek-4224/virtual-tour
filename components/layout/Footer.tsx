import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Github, Mail } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">{nav("tagline")}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("description")}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="mailto:contact@virtualtour.uz"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("quick_links")}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {nav("explore")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {nav("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("categories")}</h3>
            <ul className="space-y-2.5">
              {[
                "cat_historical",
                "cat_nature",
                "cat_architecture",
                "cat_museums",
              ].map((key) => (
                <li key={key}>
                  <Link
                    href="/explore"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(key as "cat_historical" | "cat_nature" | "cat_architecture" | "cat_museums")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Virtual Tour Uzbekistan. {t("rights")}
          </p>
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            🎓 {t("thesis_note")}
          </span>
        </div>
      </div>
    </footer>
  );
}
