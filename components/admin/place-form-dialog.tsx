'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface Translation {
  locale: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

interface City {
  id: string;
  slug: string;
  flagEmoji?: string | null;
  translations: { locale: string; name: string }[];
  country: { flagEmoji?: string | null; translations: { locale: string; name: string }[] };
}

interface Props {
  mode: 'create' | 'edit';
  locale: string;
  cities: City[];
  place?: {
    id: string;
    slug: string;
    cityId: string;
    category: string;
    coverImage: string;
    latitude: number;
    longitude: number;
    mapEmbedUrl: string;
    featured: boolean;
    translations: Translation[];
  };
}

const CATEGORIES = [
  'monument', 'mosque', 'church', 'mausoleum', 'fortress', 'palace',
  'museum', 'bazaar', 'park', 'fountain', 'walled-city', 'necropolis',
  'religious', 'nature', 'other',
];

export function PlaceFormDialog({ mode, locale, cities, place }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getT = (loc: string, field: keyof Translation) =>
    place?.translations.find((t) => t.locale === loc)?.[field] || '';

  const [form, setForm] = useState({
    slug: place?.slug || '',
    cityId: place?.cityId || '',
    category: place?.category || '',
    coverImage: place?.coverImage || '',
    latitude: place?.latitude?.toString() || '',
    longitude: place?.longitude?.toString() || '',
    mapEmbedUrl: place?.mapEmbedUrl || '',
    featured: place?.featured ?? false,
    title_en: getT('en', 'title'),
    title_ru: getT('ru', 'title'),
    title_uz: getT('uz', 'title'),
    short_en: getT('en', 'shortDescription'),
    short_ru: getT('ru', 'shortDescription'),
    short_uz: getT('uz', 'shortDescription'),
    full_en: getT('en', 'fullDescription'),
    full_ru: getT('ru', 'fullDescription'),
    full_uz: getT('uz', 'fullDescription'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      slug: form.slug,
      cityId: form.cityId,
      category: form.category,
      coverImage: form.coverImage,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      mapEmbedUrl: form.mapEmbedUrl,
      featured: form.featured,
      translations: [
        { locale: 'en', title: form.title_en, shortDescription: form.short_en, fullDescription: form.full_en },
        { locale: 'ru', title: form.title_ru, shortDescription: form.short_ru, fullDescription: form.full_ru },
        { locale: 'uz', title: form.title_uz, shortDescription: form.short_uz, fullDescription: form.full_uz },
      ],
    };
    try {
      const url = mode === 'create' ? '/api/admin/places' : `/api/admin/places/${place!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: mode === 'create' ? 'Place created' : 'Place updated' });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const f = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Place
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Place' : 'Edit Place'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={f('slug')} placeholder="e.g., registan-square" required disabled={mode === 'edit'} />
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Select value={form.cityId} onValueChange={(v) => setForm((p) => ({ ...p, cityId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => {
                    const cName = c.translations.find((t) => t.locale === 'en')?.name || c.slug;
                    const country = c.country.translations.find((t) => t.locale === 'en')?.name || '';
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.country.flagEmoji} {country} / {cName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input value={form.coverImage} onChange={f('coverImage')} placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input value={form.latitude} onChange={f('latitude')} placeholder="39.6542" type="number" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input value={form.longitude} onChange={f('longitude')} placeholder="66.9758" type="number" step="any" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input value={form.mapEmbedUrl} onChange={f('mapEmbedUrl')} placeholder="https://www.google.com/maps/embed?..." />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-place"
              checked={form.featured}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="featured-place">Featured</Label>
          </div>

          {/* Translations */}
          <div className="border border-blue-800/30 rounded-xl p-4 space-y-6">
            <p className="text-sm font-semibold text-blue-300/70 uppercase tracking-wider">Translations</p>
            {[
              { loc: 'en', label: 'English', titleKey: 'title_en' as const, shortKey: 'short_en' as const, fullKey: 'full_en' as const },
              { loc: 'ru', label: 'Russian', titleKey: 'title_ru' as const, shortKey: 'short_ru' as const, fullKey: 'full_ru' as const },
              { loc: 'uz', label: 'Uzbek', titleKey: 'title_uz' as const, shortKey: 'short_uz' as const, fullKey: 'full_uz' as const },
            ].map(({ loc, label, titleKey, shortKey, fullKey }) => (
              <div key={loc} className="space-y-2">
                <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">{label}</p>
                <Input value={form[titleKey]} onChange={f(titleKey)} placeholder={`Title in ${label}`} required={loc === 'en'} />
                <Textarea value={form[shortKey]} onChange={f(shortKey)} placeholder="Short description (1-2 sentences)" rows={2} />
                <Textarea value={form[fullKey]} onChange={f(fullKey)} placeholder="Full description (multiple paragraphs, use blank lines)" rows={5} />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
