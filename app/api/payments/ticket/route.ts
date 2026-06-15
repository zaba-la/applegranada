import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { ticketId } = await req.json() as { ticketId: string };
    if (!ticketId) return NextResponse.json({ error: 'Falta ticketId' }, { status: 400 });

    const customer = await prisma.customer.findFirst({
      where: { user: { email: session.user!.email! } },
      include: { user: { select: { email: true, name: true } } },
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

    // Calculate price based on estimatedHours if available
    const hourlyRate = ticket.serviceMode === 'ON_SITE' ? 39 : 19;
    const hours = (ticket as { estimatedHours?: number | null }).estimatedHours
      ?? (ticket.serviceMode === 'ON_SITE' ? 2 : 1);
    const amount = hourlyRate * hours;

    const siteUrl = process.env.NEXTAUTH_URL ?? 'https://applegranada.com';
    const modeLabel = ticket.serviceMode === 'ON_SITE' ? 'Soporte presencial' : 'Soporte remoto';
    const hoursLabel = `${hours} hora${hours !== 1 ? 's' : ''} · ${hourlyRate}€/hora`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'es',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${modeLabel} — Ticket ${ticket.ticketCode}`,
              description: hoursLabel,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customer.user.email,
      metadata: {
        ticketId: ticket.id,
        customerId: customer.id,
        ticketCode: ticket.ticketCode,
      },
      success_url: `${siteUrl}/es/panel/tickets/${ticket.id}?pago=exitoso&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/es/panel/tickets/${ticket.id}`,
    });

    await prisma.payment.create({
      data: {
        paymentMethod: 'STRIPE',
        customerId: customer.id,
        ticketId: ticket.id,
        amount,
        currency: 'EUR',
        status: 'PENDING',
        stripePaymentId: checkoutSession.id,
        description: `Ticket ${ticket.ticketCode} · ${hoursLabel}`,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('[POST /api/payments/ticket]', err);
    const message = err instanceof Error ? err.message : 'Error al crear sesión de pago';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
