import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail, inviteEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, phone, segment, address, city, postalCode, country } = body;

  if (!name || !email) {
    return NextResponse.json({ error: 'Nombre y email son obligatorios' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 });
  }

  // Random unusable password + invite token valid 7 days
  const randomPassword = await bcrypt.hash(randomBytes(32).toString('hex'), 12);
  const inviteToken = randomBytes(32).toString('hex');
  const inviteTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: randomPassword,
      role: 'CUSTOMER',
      inviteToken,
      inviteTokenExpiry,
      customer: {
        create: {
          phone: phone ?? null,
          segment: segment ?? null,
          address: address ?? null,
          city: city ?? null,
          postalCode: postalCode ?? null,
          country: country ?? null,
        },
      },
    },
  });

  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://soportegranada.com';
  const link = `${siteUrl}/es/establecer-password?token=${inviteToken}`;

  try {
    await sendEmail(email, 'Bienvenido a Soporte Granada — Establece tu contraseña', inviteEmailHtml({ name, link }));
  } catch (err) {
    console.error('[invite] Email no enviado:', err);
  }

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
