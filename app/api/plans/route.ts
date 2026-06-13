import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreatePlanSchema } from '@/lib/schemas';

export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ segment: 'asc' }, { priceRemote: 'asc' }],
  });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CreatePlanSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const plan = await prisma.plan.create({
    data: {
      ...parsed.data,
      features: JSON.stringify(parsed.data.features),
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
