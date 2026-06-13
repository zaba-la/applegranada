import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateSubscriptionSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const parsed = CreateSubscriptionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user.email } },
  });
  if (!customer) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  const plan = await prisma.plan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });

  const subscription = await prisma.subscription.upsert({
    where: { customerId: customer.id },
    create: {
      customerId: customer.id,
      planId: parsed.data.planId,
      serviceMode: parsed.data.serviceMode,
      status: 'ACTIVE',
    },
    update: {
      planId: parsed.data.planId,
      serviceMode: parsed.data.serviceMode,
      status: 'ACTIVE',
    },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { planId: parsed.data.planId },
  });

  return NextResponse.json(subscription, { status: 201 });
}
