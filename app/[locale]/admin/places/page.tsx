import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/admin/delete-button';
import { PlaceFormDialog } from '@/components/admin/place-form-dialog';

async function getPlaces() {
  return prisma.place.findMany({
    include: {
      translations: true,
      city: {
        include: {
          translations: true,
          country: { include: { translations: true } },
        },
      },
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
      _count: { select: { images: true, videos: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getCities() {
  return prisma.city.findMany({
    include: {
      translations: true,
      country: { include: { translations: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function AdminPlacesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [places, cities] = await Promise.all([getPlaces(), getCities()]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Places</h1>
          <p className="text-blue-300/60 mt-1">{places.length} places</p>
        </div>
        <PlaceFormDialog mode="create" locale={locale} cities={cities} />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Place</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {places.map((place) => {
              const title =
                place.translations.find((t) => t.locale === 'en')?.title || place.slug;
              const cityName =
                place.city.translations.find((t) => t.locale === 'en')?.name || '';
              const countryName =
                place.city.country.translations.find((t) => t.locale === 'en')?.name || '';
              const thumb = place.images[0]?.url || place.coverImage;

              return (
                <TableRow key={place.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {thumb ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={thumb}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-white text-sm">{title}</p>
                        <p className="text-blue-300/40 font-mono text-xs">{place.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-200/70 text-sm">
                    <span className="text-blue-300/50">{countryName} /</span> {cityName}
                  </TableCell>
                  <TableCell>
                    {place.category && (
                      <Badge variant="secondary" className="capitalize">{place.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-blue-200/60 text-sm">
                    📷 {place._count.images} · 🎬 {place._count.videos}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        place.featured
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-900/20 text-blue-400/50 border-blue-800/30'
                      }`}
                    >
                      {place.featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PlaceFormDialog
                        mode="edit"
                        locale={locale}
                        cities={cities}
                        place={{
                          id: place.id,
                          slug: place.slug,
                          cityId: place.cityId,
                          category: place.category ?? '',
                          coverImage: place.coverImage ?? '',
                          latitude: place.latitude ?? 0,
                          longitude: place.longitude ?? 0,
                          mapEmbedUrl: place.mapEmbedUrl ?? '',
                          featured: place.featured,
                          translations: place.translations,
                        }}
                      />
                      <DeleteButton
                        id={place.id}
                        endpoint="/api/admin/places"
                        label="place"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {places.length === 0 && (
          <div className="p-12 text-center text-blue-300/40">No places. Add one above.</div>
        )}
      </div>
    </div>
  );
}
