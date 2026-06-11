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
    const { countryId, coverImage, featured, translations } = body;

    await prisma.cityTranslation.deleteMany({ where: { cityId: params.id } });

    const city = await prisma.city.update({
      where: { id: params.id },
      data: {
        countryId,
        coverImage,
        featured: featured ?? false,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            name: t.name,
            description: t.description || null,
          })),
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(city);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.city.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
