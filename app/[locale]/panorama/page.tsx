import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MapPin, Globe2 } from 'lucide-react';
import { PanoramaTourSection, type PanoramaItem } from '@/components/PanoramaTourSection';
import { Badge } from '@/components/ui/badge';

// ── Panorama data ─────────────────────────────────────────────────────────────
// Adjust haov / vaov / vOffset per image if it looks stretched or off-center:
//   haov  — horizontal angle of view of the image (10–360 °)
//   vaov  — vertical angle of view of the image  (10–180 °)
//   vOffset — vertical offset of the image center  (negative = tilt down)
const panoramas: PanoramaItem[] = [
  { id: 1, title: 'Tashkent City — 1-panorama', imageUrl: '/panoramas/IMG_5356.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 2, title: 'Tashkent City — 2-panorama', imageUrl: '/panoramas/IMG_5357.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 3, title: 'Tashkent City — 3-panorama', imageUrl: '/panoramas/IMG_5358.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 4, title: 'Tashkent City — 4-panorama', imageUrl: '/panoramas/IMG_5359.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 5, title: 'Tashkent City — 5-panorama', imageUrl: '/panoramas/IMG_5360.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 6, title: 'Tashkent City — 6-panorama', imageUrl: '/panoramas/IMG_5361.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 7, title: 'Tashkent City — 7-panorama', imageUrl: '/panoramas/IMG_5362.jpg', haov: 140, vaov: 55, vOffset: 0 },
  { id: 8, title: 'Tashkent City — 8-panorama', imageUrl: '/panoramas/IMG_5363.jpg', haov: 140, vaov: 55, vOffset: 0 },
];
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'panorama' });
  return {
    title: t('title') + ' — Virtual Travel Platform',
    description: t('subtitle'),
  };
}

export default async function PanoramaPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'panorama' });

  return (
    <div className="min-h-screen bg-[#050b1f]">
      {/* ── Page hero ── */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]"
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <Badge className="mb-4 inline-flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" />
            360°
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            {t('title')}
          </h1>

          <p className="text-blue-200/55 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Interactive panorama viewer + gallery */}
          <PanoramaTourSection
            panoramas={panoramas}
            selectHint={t('selectView')}
            dragHint={t('dragHint')}
          />

          {/* About Tashkent City */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-900/30 border border-blue-600/30 flex items-center justify-center text-xl">
                  🏙️
                </div>
                <h2 className="text-xl font-bold text-white">{t('aboutTitle')}</h2>
              </div>
              <p className="text-blue-200/60 leading-relaxed text-base">
                {t('aboutText')}
              </p>
            </div>

            <div className="space-y-4">
              {/* Location info */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold text-sm">{t('location')}</span>
                </div>
                <p className="text-blue-200/55 text-sm">Tashkent, Uzbekistan 🇺🇿</p>
              </div>

              {/* Tip */}
              <div className="glass-card rounded-2xl p-5 border-blue-600/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
                  {t('tipTitle')}
                </p>
                <p className="text-blue-200/50 text-sm leading-relaxed">
                  {t('tipText')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
