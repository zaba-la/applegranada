import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdatePlanSchema } from '@/lib/schemas';

function adminOnly(session: { user?: { role?: string } } | null) {
  return !session || session.user?.role !== 'ADMIN';
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const plan = await prisma.plan.findUnique({ where: { id: params.id } });
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json();
  const parsed = UpdatePlanSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const plan = await prisma.plan.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      features: parsed.data.features ? JSON.stringify(parsed.data.features) : undefined,
    },
  });

  return NextResponse.json(plan);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  await prisma.plan.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
