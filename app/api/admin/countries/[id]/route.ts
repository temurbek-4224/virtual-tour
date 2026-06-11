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
    const { flagEmoji, coverImage, featured, translations } = body;

    // Delete old translations and recreate
    await prisma.countryTranslation.deleteMany({ where: { countryId: params.id } });

    const country = await prisma.country.update({
      where: { id: params.id },
      data: {
        flagEmoji,
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

    return NextResponse.json(country);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.country.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
