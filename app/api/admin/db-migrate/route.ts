import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "estimatedHours" DOUBLE PRECISION;`
    );
    return NextResponse.json({ ok: true, message: 'Columna estimatedHours añadida correctamente' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
