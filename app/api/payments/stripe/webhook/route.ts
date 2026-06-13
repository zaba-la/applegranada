import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { planId, serviceMode, userId } = session.metadata ?? {};

      if (planId && userId) {
        const customer = await prisma.customer.findFirst({ where: { user: { id: userId } } });
        if (customer) {
          await prisma.subscription.upsert({
            where: { customerId: customer.id },
            create: {
              customerId: customer.id,
              planId,
              serviceMode: serviceMode ?? 'REMOTE',
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
            },
            update: {
              planId,
              serviceMode: serviceMode ?? 'REMOTE',
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
            },
          });
          await prisma.customer.update({ where: { id: customer.id }, data: { planId } });
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: 'CANCELLED' },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
