import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PanoramaPageClient from "@/components/panorama/PanoramaPageClient";
import { panoramas } from "@/lib/panorama-data";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "panorama" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PanoramaPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "panorama" });

  return (
    <PanoramaPageClient
      panoramas={panoramas}
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      selectLabel={t("select_panorama")}
      formatNote={t("format_note")}
    />
  );
}
