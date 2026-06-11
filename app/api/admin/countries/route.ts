import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: { translations: true, _count: { select: { cities: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(countries);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, flagEmoji, coverImage, featured, translations } = body;

    const country = await prisma.country.create({
      data: {
        slug,
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

    return NextResponse.json(country, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
