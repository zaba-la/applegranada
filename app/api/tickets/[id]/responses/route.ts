import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail, ticketResponseEmailHtml } from '@/lib/email';
import { z } from 'zod';

const CreateResponseSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío'),
  attachments: z
    .array(z.object({ name: z.string(), url: z.string(), size: z.number(), type: z.string() }))
    .optional(),
  newStatus: z
    .enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED'])
    .optional(),
});

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
  const parsed = CreateResponseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { message, attachments, newStatus } = parsed.data;

  const response = await prisma.ticketResponse.create({
    data: {
      ticketId: params.id,
      message,
      isFromAdmin: isAdmin,
      attachments: attachments ? JSON.stringify(attachments) : undefined,
    },
  });

  // Status update
  if (isAdmin && newStatus && newStatus !== ticket.status) {
    await prisma.ticket.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        closedAt: newStatus === 'CLOSED' ? new Date() : undefined,
      },
    });
  } else if (isAdmin && ticket.status === 'OPEN') {
    await prisma.ticket.update({ where: { id: params.id }, data: { status: 'IN_PROGRESS' } });
  }

  // Email to customer when admin responds
  if (isAdmin) {
    try {
      await sendEmail(
        ticket.customer.user.email,
        `Actualización en tu ticket — ${ticket.ticketCode}`,
        ticketResponseEmailHtml({
          customerName: ticket.customer.user.name,
          ticketCode: ticket.ticketCode,
          ticketTitle: ticket.title,
          adminMessage: message,
          newStatus: newStatus ?? undefined,
        })
      );
    } catch (err) {
      console.error('[ticket-response] Error enviando email:', err);
    }
  }

  return NextResponse.json(response, { status: 201 });
}
