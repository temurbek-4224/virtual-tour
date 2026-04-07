import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <div className="text-5xl mb-6">🗺️</div>
        <h1 className="text-2xl font-bold mb-2">{t("not_found")}</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          {t("not_found_desc")}
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            {t("go_home")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
