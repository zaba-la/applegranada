import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// Fallback for when the Stripe webhook fires after the redirect.
// Primary confirmation is handled by /api/webhooks/stripe.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { ticketId, sessionId } = await req.json() as { ticketId: string; sessionId: string };
  if (!ticketId || !sessionId) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user!.email! } },
  });
  if (!customer) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  // Check if webhook already confirmed it
  const alreadyPaid = await prisma.payment.findFirst({
    where: { ticketId, customerId: customer.id, status: 'COMPLETED' },
  });
  if (alreadyPaid) return NextResponse.json({ ok: true, status: 'COMPLETED' });

  // Fallback: verify directly with Stripe
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status === 'paid') {
      await prisma.payment.updateMany({
        where: { stripePaymentId: sessionId, status: 'PENDING' },
        data: { status: 'COMPLETED' },
      });
      return NextResponse.json({ ok: true, status: 'COMPLETED' });
    }
    return NextResponse.json({ ok: false, status: 'PENDING' });
  } catch {
    return NextResponse.json({ error: 'No se pudo verificar con Stripe' }, { status: 400 });
  }
}
