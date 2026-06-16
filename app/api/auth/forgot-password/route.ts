import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail, resetPasswordEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  const { email } = await req.json() as { email: string };

  if (!email) {
    return NextResponse.json({ error: 'El email es obligatorio' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return ok to avoid email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: { inviteToken: token, inviteTokenExpiry: expiry },
  });

  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://soportegranada.com';
  const link = `${siteUrl}/es/establecer-password?token=${token}`;

  try {
    await sendEmail(
      email,
      'Recupera tu contraseña — Soporte Granada',
      resetPasswordEmailHtml({ name: user.name ?? 'Cliente', link })
    );
  } catch (err) {
    console.error('[forgot-password] Email no enviado:', err);
  }

  return NextResponse.json({ ok: true });
}
