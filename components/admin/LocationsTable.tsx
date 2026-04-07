"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Pencil, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationRow } from "@/lib/admin-types";

interface LocationsTableProps {
  rows: LocationRow[];
}

type SortField = "name" | "category" | "region";
type SortDir = "asc" | "desc";

const CATEGORY_COLORS: Record<string, string> = {
  historical:   "bg-amber-50  text-amber-700  border-amber-200",
  architecture: "bg-blue-50   text-blue-700   border-blue-200",
  museum:       "bg-purple-50 text-purple-700 border-purple-200",
  bazaar:       "bg-rose-50   text-rose-700   border-rose-200",
  mausoleum:    "bg-teal-50   text-teal-700   border-teal-200",
  mosque:       "bg-green-50  text-green-700  border-green-200",
  nature:       "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_COLORS[category] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", cls)}>
      {category}
    </span>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
      published
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-gray-50 text-gray-500 border-gray-200"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-green-500" : "bg-gray-400")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function LocationsTable({ rows }: LocationsTableProps) {
  const pathname = usePathname();
  const locale = pathname.match(/^\/(en|uz|ru)/)?.[1] ?? "en";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const categories = useMemo(() => {
    const set = new Set(rows.map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    let result = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.region.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    result.sort((a, b) => {
      const av = a[sortField].toLowerCase();
      const bv = b[sortField].toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return result;
  }, [rows, search, categoryFilter, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-primary" />
      : <ChevronDown className="h-3 w-3 text-primary" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations..."
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                categoryFilter === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 capitalize"
              )}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Add button */}
        <Link
          href={`/${locale}/admin/locations/new`}
          className="ml-auto flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Location
        </Link>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {rows.length} locations
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("category")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Category <SortIcon field="category" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("region")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Region <SortIcon field="region" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Images
                </th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    No locations match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={row.category} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.region}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                        {row.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge published={row.isPublished} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {row.imageCount} file{row.imageCount !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/${locale}/admin/locations/${row.slug}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
