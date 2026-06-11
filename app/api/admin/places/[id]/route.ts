import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === 'ADMIN' ? session : null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      cityId, category, coverImage, latitude, longitude,
      mapEmbedUrl, featured, translations,
    } = body;

    await prisma.placeTranslation.deleteMany({ where: { placeId: params.id } });

    const place = await prisma.place.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(place);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.place.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
