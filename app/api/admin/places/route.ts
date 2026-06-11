import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === 'ADMIN' ? session : null;
}

export async function GET() {
  const places = await prisma.place.findMany({
    include: {
      translations: true,
      city: { include: { translations: true, country: { include: { translations: true } } } },
      images: { take: 1 },
      _count: { select: { images: true, videos: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(places);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      slug, cityId, category, coverImage, latitude, longitude,
      mapEmbedUrl, featured, translations,
    } = body;

    const place = await prisma.place.create({
      data: {
        slug,
        cityId,
        category: category || null,
        coverImage: coverImage || null,
        latitude: latitude || null,
        longitude: longitude || null,
        mapEmbedUrl: mapEmbedUrl || null,
        featured: featured ?? false,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            title: t.title,
            shortDescription: t.shortDescription,
            fullDescription: t.fullDescription,
          })),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(place, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
