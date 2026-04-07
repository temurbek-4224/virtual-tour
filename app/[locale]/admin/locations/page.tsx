import { getAllLocationsForAdmin } from "@/lib/db";
import { locationToRow } from "@/lib/admin-types";
import AdminHeader from "@/components/admin/AdminHeader";
import LocationsTable from "@/components/admin/LocationsTable";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

export default async function AdminLocationsPage() {
  const locations = await getAllLocationsForAdmin();
  const rows = locations.map(locationToRow);

  return (
    <>
      <AdminHeader
        title="Locations"
        subtitle={`${rows.length} total`}
        actions={
          <Link
            href="/admin/locations/new"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Location
          </Link>
        }
      />

      <div className="flex-1 p-6">
        <LocationsTable rows={rows} />
      </div>
    </>
  );
}
