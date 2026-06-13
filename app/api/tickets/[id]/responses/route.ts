import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateTicketResponseSchema } from '@/lib/schemas';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN';

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { customer: { include: { user: true } } },
  });

  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  if (!isAdmin && ticket.customer.user.email !== session.user.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CreateTicketResponseSchema.safeParse({ ...body, isFromAdmin: isAdmin });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const response = await prisma.ticketResponse.create({
    data: {
      ticketId: params.id,
      message: parsed.data.message,
      isFromAdmin: isAdmin,
    },
  });

  if (isAdmin && ticket.status === 'OPEN') {
    await prisma.ticket.update({ where: { id: params.id }, data: { status: 'IN_PROGRESS' } });
  }

  return NextResponse.json(response, { status: 201 });
}
