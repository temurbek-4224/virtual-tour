"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  ArrowLeft,
  Globe,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/en/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Locations",
    href: "/en/admin/locations",
    icon: MapPin,
  },
  {
    label: "Site Settings",
    href: "/en/admin/settings",
    icon: Settings,
    exact: true,
  },
];

// Helper: derive the admin base for the current locale from the pathname
function useAdminBase(): string {
  const pathname = usePathname();
  // pathname = /en/admin/... | /uz/admin/... | /ru/admin/...
  const match = pathname.match(/^\/(en|uz|ru)/);
  const locale = match ? match[1] : "en";
  return `/${locale}/admin`;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const adminBase = useAdminBase();

  function isActive(href: string, exact?: boolean): boolean {
    // Normalise href to current locale
    const localised = href.replace(/^\/(en|uz|ru)/, adminBase.replace("/admin", ""));
    if (exact) return pathname === localised;
    return pathname.startsWith(localised);
  }

  const locale = adminBase.split("/")[1] ?? "en";

  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen bg-slate-900 text-white border-r border-slate-800 sticky top-0">
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Globe className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Virtual Tour</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Main
        </p>

        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const localisedHref = href.replace(/^\/(en|uz|ru)/, `/${locale}`);
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={localisedHref}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}

        {/* Add Location quick link */}
        <div className="pt-4">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Quick Actions
          </p>
          <Link
            href={`/${locale}/admin/locations/new`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 text-xs font-bold text-slate-300">
              +
            </span>
            New Location
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all duration-150"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Site
        </Link>
        <p className="px-3 text-[10px] text-slate-600 mt-2">
          Graduation Thesis Project · 2025–2026
        </p>
      </div>
    </aside>
  );
}
