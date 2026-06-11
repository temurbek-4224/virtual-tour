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
  name: string;
  description?: string | null;
}

interface Country {
  id: string;
  slug: string;
  flagEmoji?: string | null;
  translations: { locale: string; name: string }[];
}

interface Props {
  mode: 'create' | 'edit';
  locale: string;
  countries: Country[];
  city?: {
    id: string;
    slug: string;
    countryId: string;
    coverImage: string;
    featured: boolean;
    translations: Translation[];
  };
}

export function CityFormDialog({ mode, locale, countries, city }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getT = (loc: string, field: 'name' | 'description') =>
    city?.translations.find((t) => t.locale === loc)?.[field] || '';

  const [form, setForm] = useState({
    slug: city?.slug || '',
    countryId: city?.countryId || '',
    coverImage: city?.coverImage || '',
    featured: city?.featured ?? false,
    name_en: getT('en', 'name'),
    name_ru: getT('ru', 'name'),
    name_uz: getT('uz', 'name'),
    desc_en: getT('en', 'description'),
    desc_ru: getT('ru', 'description'),
    desc_uz: getT('uz', 'description'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      slug: form.slug,
      countryId: form.countryId,
      coverImage: form.coverImage,
      featured: form.featured,
      translations: [
        { locale: 'en', name: form.name_en, description: form.desc_en },
        { locale: 'ru', name: form.name_ru, description: form.desc_ru },
        { locale: 'uz', name: form.name_uz, description: form.desc_uz },
      ],
    };
    try {
      const url = mode === 'create' ? '/api/admin/cities' : `/api/admin/cities/${city!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: mode === 'create' ? 'City created' : 'City updated' });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add City
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add City' : 'Edit City'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={f('slug')}
                placeholder="e.g., samarkand"
                required
                disabled={mode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select
                value={form.countryId}
                onValueChange={(v) => setForm((p) => ({ ...p, countryId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => {
                    const name = c.translations.find((t) => t.locale === 'en')?.name || c.slug;
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.flagEmoji} {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <Input value={form.coverImage} onChange={f('coverImage')} placeholder="https://..." />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-city"
              checked={form.featured}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="featured-city">Featured on homepage</Label>
          </div>

          <div className="border border-blue-800/30 rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-blue-300/70 uppercase tracking-wider">
              Translations
            </p>
            {[
              { loc: 'en', label: 'English', nameKey: 'name_en' as const, descKey: 'desc_en' as const },
              { loc: 'ru', label: 'Russian', nameKey: 'name_ru' as const, descKey: 'desc_ru' as const },
              { loc: 'uz', label: 'Uzbek', nameKey: 'name_uz' as const, descKey: 'desc_uz' as const },
            ].map(({ loc, label, nameKey, descKey }) => (
              <div key={loc} className="space-y-2">
                <p className="text-xs font-medium text-blue-400 uppercase">{label}</p>
                <Input value={form[nameKey]} onChange={f(nameKey)} placeholder={`Name in ${label}`} required={loc === 'en'} />
                <Textarea value={form[descKey]} onChange={f(descKey)} placeholder={`Description in ${label}`} rows={2} />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
