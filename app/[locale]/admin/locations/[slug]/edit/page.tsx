import { notFound } from "next/navigation";
import { getLocationBySlug } from "@/lib/db";
import { locations } from "@/lib/data"; // used for static params generation
import { locationToFormData } from "@/lib/admin-types";
import AdminHeader from "@/components/admin/AdminHeader";
import LocationForm from "@/components/admin/LocationForm";

type Props = {
  params: { slug: string; locale: string };
};

// Pre-generate static params from local data; DB adds more at runtime
export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export default async function EditLocationPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const location = await getLocationBySlug(slug);

  if (!location) notFound();

  const formData = locationToFormData(location);

  return (
    <>
      <AdminHeader
        title={`Edit — ${location.translations.en.name}`}
        subtitle={`${location.region} · ${location.category}`}
      />

      <div className="flex-1 p-6 max-w-4xl">
        <LocationForm
          initialData={formData}
          mode="edit"
          locationId={location.id}
        />
      </div>
    </>
  );
}
