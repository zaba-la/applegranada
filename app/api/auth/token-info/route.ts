import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Falta token' }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { inviteToken: token, inviteTokenExpiry: { gt: new Date() } },
    select: { email: true, name: true },
  });

  if (!user) return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 404 });

  return NextResponse.json({ email: user.email, name: user.name });
}
