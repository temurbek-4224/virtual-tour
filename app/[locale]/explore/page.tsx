// Server component — fetches locations from DB (or local fallback),
// then passes them to the interactive client component.

import { getLocations } from "@/lib/db";
import ExploreClient from "@/components/explore/ExploreClient";

export default async function ExplorePage() {
  const locations = await getLocations();
  return <ExploreClient locations={locations} />;
}
