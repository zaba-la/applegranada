import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Stripe requires the raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[webhook] Signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status === 'paid') {
      const ticketId = session.metadata?.ticketId;
      const stripeSessionId = session.id;

      if (!ticketId) {
        console.error('[webhook] checkout.session.completed without ticketId metadata');
        return NextResponse.json({ received: true });
      }

      // Mark the payment as COMPLETED
      await prisma.payment.updateMany({
        where: {
          stripePaymentId: stripeSessionId,
          status: 'PENDING',
        },
        data: {
          status: 'COMPLETED',
          stripePaymentId: stripeSessionId,
        },
      });

      console.log(`[webhook] Payment confirmed for ticket ${ticketId}, session ${stripeSessionId}`);
    }
  }

  return NextResponse.json({ received: true });
}
