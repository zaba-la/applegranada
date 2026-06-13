import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// One-time admin setup endpoint.
// Protected by SETUP_SECRET env var — must match the request header.
// Does nothing if an ADMIN user already exists.
export async function POST(req: Request) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'SETUP_SECRET no configurado' }, { status: 403 });
  }

  const authHeader = req.headers.get('x-setup-secret');
  if (authHeader !== secret) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Check if admin already exists
  const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existing) {
    return NextResponse.json({ message: 'Admin ya existe', email: existing.email });
  }

  const body = await req.json().catch(() => ({}));
  const email = body.email ?? 'miguel@zaba.la';
  const name = body.name ?? 'Miguel Zabala';
  const password = body.password ?? 'Espanoles@2027';

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.user.create({
    data: { email, name, password: hashed, role: 'ADMIN', locale: 'es' },
  });

  return NextResponse.json({ message: 'Admin creado', email: admin.email }, { status: 201 });
}
