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
import { useToast } from '@/components/ui/use-toast';

interface CountryTranslation {
  locale: string;
  name: string;
  description?: string | null;
}

interface Props {
  mode: 'create' | 'edit';
  locale: string;
  country?: {
    id: string;
    slug: string;
    flagEmoji: string;
    coverImage: string;
    featured: boolean;
    translations: CountryTranslation[];
  };
}

export function CountryFormDialog({ mode, locale, country }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getTranslation = (loc: string, field: 'name' | 'description') => {
    const t = country?.translations.find((t) => t.locale === loc);
    return t?.[field] || '';
  };

  const [form, setForm] = useState({
    slug: country?.slug || '',
    flagEmoji: country?.flagEmoji || '',
    coverImage: country?.coverImage || '',
    featured: country?.featured ?? false,
    name_en: getTranslation('en', 'name'),
    name_ru: getTranslation('ru', 'name'),
    name_uz: getTranslation('uz', 'name'),
    desc_en: getTranslation('en', 'description'),
    desc_ru: getTranslation('ru', 'description'),
    desc_uz: getTranslation('uz', 'description'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      slug: form.slug,
      flagEmoji: form.flagEmoji,
      coverImage: form.coverImage,
      featured: form.featured,
      translations: [
        { locale: 'en', name: form.name_en, description: form.desc_en },
        { locale: 'ru', name: form.name_ru, description: form.desc_ru },
        { locale: 'uz', name: form.name_uz, description: form.desc_uz },
      ],
    };

    try {
      const url = mode === 'create' ? '/api/admin/countries' : `/api/admin/countries/${country!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({
        title: mode === 'create' ? 'Country created' : 'Country updated',
        description: `${form.name_en} has been ${mode === 'create' ? 'created' : 'updated'}.`,
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Country
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
          <DialogTitle>{mode === 'create' ? 'Add Country' : 'Edit Country'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={f('slug')}
                placeholder="e.g., uzbekistan"
                required
                disabled={mode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flagEmoji">Flag Emoji</Label>
              <Input
                id="flagEmoji"
                value={form.flagEmoji}
                onChange={f('flagEmoji')}
                placeholder="🇺🇿"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={form.coverImage}
              onChange={f('coverImage')}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>

          {/* Translations */}
          <div className="border border-blue-800/30 rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-blue-300/70 uppercase tracking-wider">Translations</p>
            {[
              { locale: 'en', label: 'English', nameKey: 'name_en' as const, descKey: 'desc_en' as const },
              { locale: 'ru', label: 'Russian', nameKey: 'name_ru' as const, descKey: 'desc_ru' as const },
              { locale: 'uz', label: 'Uzbek', nameKey: 'name_uz' as const, descKey: 'desc_uz' as const },
            ].map(({ locale: loc, label, nameKey, descKey }) => (
              <div key={loc} className="space-y-2">
                <p className="text-xs font-medium text-blue-400 uppercase">{label}</p>
                <Input
                  value={form[nameKey]}
                  onChange={f(nameKey)}
                  placeholder={`Name in ${label}`}
                  required={loc === 'en'}
                />
                <Textarea
                  value={form[descKey]}
                  onChange={f(descKey)}
                  placeholder={`Description in ${label}`}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
