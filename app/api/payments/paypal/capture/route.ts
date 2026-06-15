import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { orderId, ticketId } = (await req.json()) as {
      orderId: string;
      ticketId: string;
    };
    if (!orderId || !ticketId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    const completed = await capturePayPalOrder(orderId);
    if (!completed) {
      return NextResponse.json({ error: 'El pago no se completó en PayPal' }, { status: 400 });
    }

    await prisma.payment.updateMany({
      where: { paypalOrderId: orderId, ticketId },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/payments/paypal/capture]', err);
    const message = err instanceof Error ? err.message : 'Error al capturar el pago';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
