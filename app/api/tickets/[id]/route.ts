import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateTicketSchema } from '@/lib/schemas';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { responses: { orderBy: { createdAt: 'asc' } }, customer: { include: { user: true } } },
  });

  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
  if (!isAdmin && ticket.customer.user.email !== session.user.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json();
  const parsed = UpdateTicketSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const ticket = await prisma.ticket.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      closedAt: parsed.data.status === 'CLOSED' ? new Date() : undefined,
    },
  });

  return NextResponse.json(ticket);
}
