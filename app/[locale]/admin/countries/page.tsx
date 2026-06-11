import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Globe, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { DeleteButton } from '@/components/admin/delete-button';
import { CountryFormDialog } from '@/components/admin/country-form-dialog';

async function getCountries() {
  return prisma.country.findMany({
    include: {
      translations: true,
      _count: { select: { cities: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminCountriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const countries = await getCountries();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Countries</h1>
          <p className="text-blue-300/60 mt-1">{countries.length} countries</p>
        </div>
        <CountryFormDialog mode="create" locale={locale} />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Cities</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => {
              const name =
                country.translations.find((t) => t.locale === 'en')?.name || country.slug;
              return (
                <TableRow key={country.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flagEmoji || '🌍'}</span>
                      <span className="font-medium text-white">{name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-300/60 font-mono text-xs">{country.slug}</TableCell>
                  <TableCell className="text-blue-200/70">{country._count.cities}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        country.featured
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-900/20 text-blue-400/50 border-blue-800/30'
                      }`}
                    >
                      {country.featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CountryFormDialog
                        mode="edit"
                        locale={locale}
                        country={{
                          id: country.id,
                          slug: country.slug,
                          flagEmoji: country.flagEmoji ?? '',
                          coverImage: country.coverImage ?? '',
                          featured: country.featured,
                          translations: country.translations,
                        }}
                      />
                      <DeleteButton
                        id={country.id}
                        endpoint="/api/admin/countries"
                        label="country"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {countries.length === 0 && (
          <div className="p-12 text-center text-blue-300/40">No countries. Add one above.</div>
        )}
      </div>
    </div>
  );
}
