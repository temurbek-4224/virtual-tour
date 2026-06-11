import { prisma } from '@/lib/prisma';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';
import { CityFormDialog } from '@/components/admin/city-form-dialog';

async function getCities() {
  return prisma.city.findMany({
    include: {
      translations: true,
      country: { include: { translations: true } },
      _count: { select: { places: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getCountries() {
  return prisma.country.findMany({
    include: { translations: true },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function AdminCitiesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [cities, countries] = await Promise.all([getCities(), getCountries()]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Cities</h1>
          <p className="text-blue-300/60 mt-1">{cities.length} cities</p>
        </div>
        <CityFormDialog mode="create" locale={locale} countries={countries} />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Places</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => {
              const name =
                city.translations.find((t) => t.locale === 'en')?.name || city.slug;
              const countryName =
                city.country.translations.find((t) => t.locale === 'en')?.name ||
                city.country.slug;

              return (
                <TableRow key={city.id}>
                  <TableCell className="font-medium text-white">{name}</TableCell>
                  <TableCell className="text-blue-200/70">
                    {city.country.flagEmoji} {countryName}
                  </TableCell>
                  <TableCell className="text-blue-300/60 font-mono text-xs">{city.slug}</TableCell>
                  <TableCell className="text-blue-200/70">{city._count.places}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        city.featured
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-900/20 text-blue-400/50 border-blue-800/30'
                      }`}
                    >
                      {city.featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CityFormDialog
                        mode="edit"
                        locale={locale}
                        countries={countries}
                        city={{
                          id: city.id,
                          slug: city.slug,
                          countryId: city.countryId,
                          coverImage: city.coverImage ?? '',
                          featured: city.featured,
                          translations: city.translations,
                        }}
                      />
                      <DeleteButton
                        id={city.id}
                        endpoint="/api/admin/cities"
                        label="city"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {cities.length === 0 && (
          <div className="p-12 text-center text-blue-300/40">No cities. Add one above.</div>
        )}
      </div>
    </div>
  );
}
