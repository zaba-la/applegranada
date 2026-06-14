import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateTicketSchema } from '@/lib/schemas';
import { generateTicketCode, generateTicketNumber } from '@/lib/ticket-utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN';

  if (isAdmin) {
    const tickets = await prisma.ticket.findMany({
      include: { customer: { include: { user: { select: { name: true, email: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tickets);
  }

  const customer = await prisma.customer.findFirst({ where: { user: { email: session.user.email } } });
  if (!customer) return NextResponse.json([]);

  const tickets = await prisma.ticket.findMany({
    where: { customerId: customer.id },
    include: { responses: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const parsed = CreateTicketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const customer = await prisma.customer.findFirst({ where: { user: { email: session.user.email } } });
  if (!customer) return NextResponse.json({ error: 'Perfil de cliente no encontrado' }, { status: 404 });

  const ticketCount = await prisma.ticket.count();

  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber: generateTicketNumber(ticketCount + 1),
      ticketCode: generateTicketCode(),
      customerId: customer.id,
      title: parsed.data.title,
      description: parsed.data.description,
      deviceType: parsed.data.deviceType,
      priority: parsed.data.priority ?? 'MEDIUM',
      serviceMode: parsed.data.serviceMode ?? 'REMOTE',
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      estimatedHours: parsed.data.estimatedHours,
      scheduledDate: parsed.data.scheduledDate,
      attachments: body.attachments ? JSON.stringify(body.attachments) : null,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
