import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { planId, serviceMode = 'REMOTE' } = await req.json();

  if (!planId) return NextResponse.json({ error: 'planId requerido' }, { status: 400 });

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });

  const price = serviceMode === 'ON_SITE' ? plan.priceOnSite : plan.priceRemote;
  if (!price) return NextResponse.json({ error: 'Precio no disponible para este modo' }, { status: 400 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: plan.nameEs,
            description: plan.descriptionEs,
          },
          unit_amount: Math.round(price * 100),
          recurring: {
            interval: plan.billingCycle === 'ANNUAL' ? 'year' : plan.billingCycle === 'QUARTERLY' ? 'month' : 'month',
            interval_count: plan.billingCycle === 'QUARTERLY' ? 3 : 1,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      planId,
      serviceMode,
      userId: (session.user as { id?: string }).id ?? '',
    },
    success_url: `${siteUrl}/es/panel/plan?success=true`,
    cancel_url: `${siteUrl}/es/precios`,
    customer_email: session.user.email,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
