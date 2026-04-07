import { EMPTY_FORM } from "@/lib/admin-types";
import AdminHeader from "@/components/admin/AdminHeader";
import LocationForm from "@/components/admin/LocationForm";

export default function NewLocationPage() {
  return (
    <>
      <AdminHeader
        title="New Location"
        subtitle="Fill in all fields and click Create Location"
      />

      <div className="flex-1 p-6 max-w-4xl">
        <LocationForm initialData={EMPTY_FORM} mode="new" />
      </div>
    </>
  );
}
