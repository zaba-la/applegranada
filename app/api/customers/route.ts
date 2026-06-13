import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const customers = await prisma.customer.findMany({
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      plan: { select: { nameEs: true, nameEn: true } },
      subscription: { select: { status: true, serviceMode: true } },
      _count: { select: { tickets: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(customers);
}
