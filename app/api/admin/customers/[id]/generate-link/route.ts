import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true } } },
  });
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: customer.user.id },
    data: { inviteToken: token, inviteTokenExpiry: expiry },
  });

  const siteUrl = process.env.NEXTAUTH_URL ?? 'https://soportegranada.com';
  const link = `${siteUrl}/es/establecer-password?token=${token}`;

  return NextResponse.json({ link });
}
