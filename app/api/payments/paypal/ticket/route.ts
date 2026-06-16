import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { ticketId } = (await req.json()) as { ticketId: string };
    if (!ticketId) return NextResponse.json({ error: 'Falta ticketId' }, { status: 400 });

    const customer = await prisma.customer.findFirst({
      where: { user: { email: session.user!.email! } },
      include: { user: { select: { email: true } } },
    });
    if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, customerId: customer.id },
    });
    if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

    const existingPaid = await prisma.payment.findFirst({
      where: { ticketId, status: 'COMPLETED' },
    });
    if (existingPaid) {
      return NextResponse.json({ error: 'Este ticket ya tiene un pago completado' }, { status: 400 });
    }

    const hourlyRate = ticket.serviceMode === 'ON_SITE' ? 39 : 19;
    const hours =
      (ticket as { estimatedHours?: number | null }).estimatedHours ??
      (ticket.serviceMode === 'ON_SITE' ? 2 : 1);
    const amount = hourlyRate * hours;

    const siteUrl = process.env.NEXTAUTH_URL ?? 'https://soportegranada.com';
    const modeLabel =
      ticket.serviceMode === 'ON_SITE' ? 'Soporte presencial' : 'Soporte remoto';

    const { orderId, approvalUrl } = await createPayPalOrder({
      amount,
      currency: 'EUR',
      description: `${modeLabel} — Ticket ${ticket.ticketCode}`,
      returnUrl: `${siteUrl}/es/panel/tickets/${ticket.id}?paypal=success&ticketId=${ticket.id}`,
      cancelUrl: `${siteUrl}/es/panel/tickets/${ticket.id}`,
    });

    await prisma.payment.create({
      data: {
        paymentMethod: 'PAYPAL',
        customerId: customer.id,
        ticketId: ticket.id,
        amount,
        currency: 'EUR',
        status: 'PENDING',
        paypalOrderId: orderId,
        description: `Ticket ${ticket.ticketCode} · ${hours}h × ${hourlyRate}€`,
      },
    });

    return NextResponse.json({ url: approvalUrl });
  } catch (err) {
    console.error('[POST /api/payments/paypal/ticket]', err);
    const message = err instanceof Error ? err.message : 'Error al crear pago con PayPal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
