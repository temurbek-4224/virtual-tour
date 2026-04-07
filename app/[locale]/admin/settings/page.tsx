import { getSiteConfig } from "@/lib/db";
import HeroSettingsForm from "@/components/admin/HeroSettingsForm";
import { Settings, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Site Settings" };

// Always fetch fresh data — no cache for the settings page
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await getSiteConfig();

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500">
            Control global appearance settings for the public site.
          </p>
        </div>
      </div>

      {/* Hero section card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Card header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <Globe className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Homepage Hero Image</p>
            <p className="text-xs text-gray-400">
              Background image displayed on the public-facing homepage hero section.
            </p>
          </div>
        </div>

        <div className="p-5">
          <HeroSettingsForm initialHeroImageUrl={config.heroImageUrl} />
        </div>
      </div>
    </div>
  );
}
