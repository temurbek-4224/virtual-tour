import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Tag,
  Globe,
  CheckCircle,
  ArrowRight,
  Clock,
  Database,
  AlertCircle,
} from "lucide-react";
import { getDashboardStats, getAllLocationsForAdmin } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [stats, allLocations] = await Promise.all([
    getDashboardStats(),
    getAllLocationsForAdmin(),
  ]);

  // Build breakdowns from the location list (works for both DB and local fallback)
  const categoryBreakdown = allLocations.reduce<Record<string, number>>((acc, loc) => {
    acc[loc.category] = (acc[loc.category] ?? 0) + 1;
    return acc;
  }, {});

  const regionBreakdown = allLocations.reduce<Record<string, number>>((acc, loc) => {
    acc[loc.region] = (acc[loc.region] ?? 0) + 1;
    return acc;
  }, {});

  const statCards = [
    {
      title: "Total Locations",
      value: stats.totalLocations,
      description: "Across all regions and categories",
      icon: MapPin,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      description: "Historical, Museum, Bazaar…",
      icon: Tag,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Regions",
      value: stats.totalRegions,
      description: "Samarkand, Bukhara, Tashkent, Khiva",
      icon: Globe,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Published",
      value: stats.publishedLocations,
      description: "Visible on the public site",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your virtual tour content"
      />

      <div className="flex-1 p-6 space-y-8">

        {/* ── DB connection status banner ── */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
          stats.usingDatabase
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          {stats.usingDatabase ? (
            <Database className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
          )}
          <div>
            {stats.usingDatabase ? (
              <span><strong>Connected to Neon PostgreSQL.</strong> All data is live from the database.</span>
            ) : (
              <span>
                <strong>Using local mock data.</strong> To switch to real database: paste your Neon
                connection string into <code className="font-mono bg-amber-100 px-1 rounded">.env</code>,
                then run <code className="font-mono bg-amber-100 px-1 rounded">npm run db:push</code> and{" "}
                <code className="font-mono bg-amber-100 px-1 rounded">npm run db:seed</code>.
              </span>
            )}
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* ── Two-column breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Category breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <h3 className="text-sm font-semibold text-gray-700">By Category</h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <li key={cat} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-700 capitalize font-medium">{cat}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / stats.totalLocations) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-4 text-right">
                        {count}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Region breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <h3 className="text-sm font-semibold text-gray-700">By Region</h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {Object.entries(regionBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([region, count]) => (
                  <li key={region} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-700 font-medium">{region}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(count / stats.totalLocations) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-4 text-right">
                        {count}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* ── All locations list ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">All Locations</h3>
            </div>
            <Link
              href="/admin/locations"
              className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
            >
              Manage all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {allLocations.map((loc) => (
              <li
                key={loc.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {loc.translations.en.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {loc.region} · <span className="capitalize">{loc.category}</span>
                  </p>
                </div>
                <Link
                  href={`/admin/locations/${loc.slug}/edit`}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Edit →
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}
