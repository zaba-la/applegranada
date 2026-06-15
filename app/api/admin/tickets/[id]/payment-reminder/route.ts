import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail, paymentReminderEmailHtml } from '@/lib/email';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { customer: { include: { user: { select: { name: true, email: true } } } } },
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

    const hourlyRate = ticket.serviceMode === 'REMOTE' ? 19 : 39;

    await sendEmail(
      ticket.customer.user.email,
      `Recordatorio de pago — ${ticket.ticketCode}`,
      paymentReminderEmailHtml({
        customerName: ticket.customer.user.name,
        ticketCode: ticket.ticketCode,
        ticketTitle: ticket.title,
        serviceMode: ticket.serviceMode as 'REMOTE' | 'ON_SITE',
        hourlyRate,
        ticketId: ticket.id,
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[payment-reminder]', err);
    return NextResponse.json({ error: 'Error al enviar el recordatorio' }, { status: 500 });
  }
}
