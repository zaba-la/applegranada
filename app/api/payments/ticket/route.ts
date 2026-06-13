import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// Minimum amounts per service mode
const TICKET_PRICE: Record<string, number> = {
  REMOTE: 19,
  ON_SITE: 78,
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { ticketId, method } = await req.json() as { ticketId: string; method: 'STRIPE' | 'BIZUM' };
  if (!ticketId || !method) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user!.email! } },
    include: { user: { select: { email: true, name: true } } },
  });
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId, customerId: customer.id },
  });
  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

  // Check if already paid
  const existingPaid = await prisma.payment.findFirst({
    where: { ticketId, status: 'COMPLETED' },
  });
  if (existingPaid) return NextResponse.json({ error: 'Este ticket ya tiene un pago completado' }, { status: 400 });

  const amount = TICKET_PRICE[ticket.serviceMode] ?? 19;
  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://applegranada.com';

  // ── STRIPE ────────────────────────────────────────────────────────────────
  if (method === 'STRIPE') {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Soporte Apple — Ticket ${ticket.ticketCode}`,
              description: ticket.title,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customer.user.email,
      metadata: { ticketId: ticket.id, customerId: customer.id },
      success_url: `${siteUrl}/es/panel/tickets/${ticket.id}?pago=exitoso&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/es/panel/tickets/${ticket.id}`,
    });

    // Create PENDING payment record
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

  // ── BIZUM ────────────────────────────────────────────────────────────────
  if (method === 'BIZUM') {
    const bizumPhone = process.env.BIZUM_PHONE ?? '+34644411252';
    const bizumReference = ticket.ticketCode;

    // Create PENDING payment record
    await prisma.payment.create({
      data: {
        paymentMethod: 'BIZUM',
        customerId: customer.id,
        ticketId: ticket.id,
        amount,
        currency: 'EUR',
        status: 'PENDING',
        bizumReference,
        description: `Pago Bizum ticket ${ticket.ticketCode}`,
        notes: `Cliente: ${customer.user.name} (${customer.user.email})`,
      },
    });

    return NextResponse.json({ bizumPhone, amount, reference: bizumReference });
  }

  return NextResponse.json({ error: 'Método no soportado' }, { status: 400 });
}
