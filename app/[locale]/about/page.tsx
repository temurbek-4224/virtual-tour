import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Code2, Database, Globe, Layout, Layers, Zap } from "lucide-react";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("project_description") };
}

const techStack = [
  { name: "Next.js 14", desc: "React framework with App Router", icon: Layers },
  { name: "TypeScript", desc: "Typed JavaScript for reliability", icon: Code2 },
  { name: "Tailwind CSS", desc: "Utility-first CSS framework", icon: Layout },
  { name: "next-intl", desc: "Internationalization & routing", icon: Globe },
  { name: "Prisma + PostgreSQL", desc: "Database ORM (upcoming)", icon: Database },
  { name: "Vercel", desc: "Deployment & hosting platform", icon: Zap },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/5 via-primary/3 to-transparent py-20 px-4 sm:px-6">
        <div className="container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🎓 {t("year")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-12 max-w-4xl mx-auto space-y-16">
        {/* Project Overview */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("project_title")}</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {t("project_description")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Locations", value: "20+", emoji: "📍" },
              { label: "Languages", value: "3", emoji: "🌐" },
              { label: "360° VR Tours", value: "20+", emoji: "🥽" },
              { label: "Regions", value: "8", emoji: "🗺️" },
            ].map(({ label, value, emoji }) => (
              <div
                key={label}
                className="p-5 rounded-2xl border bg-card text-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-2xl font-bold mb-4">{t("mission_title")}</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {t("mission_description")}
          </p>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t("tech_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map(({ name, desc, icon: Icon }) => (
              <div
                key={name}
                className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Developer */}
        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-bold mb-4">{t("developer_title")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("developer_description")}
          </p>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              👤
            </div>
            <div>
              <p className="font-semibold">Student Developer</p>
              <p className="text-sm text-muted-foreground">{t("year")}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
