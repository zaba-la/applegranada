import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { ticketId, sessionId, method } = await req.json() as {
    ticketId: string;
    sessionId?: string; // Stripe checkout session id
    method: 'STRIPE' | 'BIZUM';
  };

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user!.email! } },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!customer) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const payment = await prisma.payment.findFirst({
    where: { ticketId, customerId: customer.id, status: 'PENDING', paymentMethod: method },
    orderBy: { createdAt: 'desc' },
  });
  if (!payment) return NextResponse.json({ error: 'Pago pendiente no encontrado' }, { status: 404 });

  // ── STRIPE: verify with Stripe API ──────────────────────────────────────
  if (method === 'STRIPE' && sessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (stripeSession.payment_status === 'paid') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'COMPLETED', stripePaymentId: stripeSession.id },
        });
        return NextResponse.json({ ok: true, status: 'COMPLETED' });
      }
    } catch {
      return NextResponse.json({ error: 'No se pudo verificar el pago con Stripe' }, { status: 400 });
    }
  }

  // ── BIZUM: mark as PROCESSING, notify admin ──────────────────────────────
  if (method === 'BIZUM') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PROCESSING', notes: (payment.notes ?? '') + ' · Cliente notificó el envío' },
    });

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    const adminEmail = process.env.SMTP_USER ?? process.env.SENDGRID_FROM_EMAIL;

    if (adminEmail && ticket) {
      try {
        await sendEmail(
          adminEmail,
          `Bizum recibido — Ticket ${ticket.ticketCode}`,
          `<p><strong>${customer.user.name}</strong> (${customer.user.email}) ha notificado el envío de <strong>${payment.amount} €</strong> por Bizum para el ticket <strong>${ticket.ticketCode}</strong>.</p><p>Concepto enviado: <code>${payment.bizumReference}</code></p><p>Confirma el pago en el panel de administración.</p>`
        );
      } catch (err) {
        console.error('[bizum-notify] Email no enviado:', err);
      }
    }

    return NextResponse.json({ ok: true, status: 'PROCESSING' });
  }

  return NextResponse.json({ error: 'Método no válido' }, { status: 400 });
}
