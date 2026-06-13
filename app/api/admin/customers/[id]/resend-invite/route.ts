import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail, inviteEmailHtml } from '@/lib/email';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  await prisma.user.update({
    where: { id: customer.user.id },
    data: { inviteToken: token, inviteTokenExpiry: expiry },
  });

  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://applegranada.com';
  const link = `${siteUrl}/es/establecer-password?token=${token}`;

  try {
    await sendEmail(
      customer.user.email,
      'Activa tu cuenta en AppleGranada',
      inviteEmailHtml({ name: customer.user.name ?? 'Cliente', link })
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[resend-invite] Email error:', msg);
    return NextResponse.json({ error: `Email no enviado: ${msg}`, link }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
