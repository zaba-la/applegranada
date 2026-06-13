import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const TICKET_PRICE: Record<string, number> = {
  REMOTE: 19,
  ON_SITE: 78,
};

const TICKET_PRICE_DESC: Record<string, string> = {
  REMOTE: '1 hora de soporte remoto (mínimo)',
  ON_SITE: '2 horas de soporte presencial (mínimo)',
};

export async function POST(req: Request) {
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

  const amount = TICKET_PRICE[ticket.serviceMode] ?? 19;
  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://applegranada.com';

  // Stripe Checkout con tarjeta y Bizum nativos
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    // Bizum aparece automáticamente junto a la tarjeta en el checkout de Stripe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payment_method_types: ['card', 'bizum'] as any,
    locale: 'es',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Soporte Apple — Ticket ${ticket.ticketCode}`,
            description: TICKET_PRICE_DESC[ticket.serviceMode] ?? ticket.title,
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

  // Registro del pago en estado PENDING (el webhook o el redirect lo confirmarán)
  await prisma.payment.create({
    data: {
      paymentMethod: 'STRIPE',
      customerId: customer.id,
      ticketId: ticket.id,
      amount,
      currency: 'EUR',
      status: 'PENDING',
      stripePaymentId: checkoutSession.id,
      description: `Pago ticket ${ticket.ticketCode}`,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
