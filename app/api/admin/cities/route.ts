import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === 'ADMIN' ? session : null;
}

export async function GET() {
  const cities = await prisma.city.findMany({
    include: {
      translations: true,
      country: { include: { translations: true } },
      _count: { select: { places: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, countryId, coverImage, featured, translations } = body;

    const city = await prisma.city.create({
      data: {
        slug,
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

    return NextResponse.json(city, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
