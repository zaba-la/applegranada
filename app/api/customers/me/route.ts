import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateCustomerSchema } from '@/lib/schemas';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user.email } },
    include: {
      user: { select: { name: true, email: true } },
      plan: true,
      subscription: true,
    },
  });

  return NextResponse.json(customer ?? {});
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateCustomerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const { name, email, ...customerData } = parsed.data;

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user.email } },
  });

  if (!customer) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  if (name || email) {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { ...(name && { name }), ...(email && { email }) },
    });
  }

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: customerData,
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(updated);
}
