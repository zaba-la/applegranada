import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Token y contraseña (mínimo 8 caracteres) son obligatorios' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      inviteToken: token,
      inviteTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'El enlace no es válido o ha expirado' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, inviteToken: null, inviteTokenExpiry: null },
  });

  return NextResponse.json({ ok: true });
}
