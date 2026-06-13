import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// One-time admin setup endpoint.
// Protected by SETUP_SECRET env var — must match the request header.
// Also creates the database schema if tables don't exist yet.
export async function POST(req: Request) {
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'SETUP_SECRET no configurado' }, { status: 403 });
  }

  const authHeader = req.headers.get('x-setup-secret');
  if (authHeader !== secret) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email = body.email ?? 'miguel@zaba.la';
  const name = body.name ?? 'Miguel Zabala';
  const password = body.password ?? 'Espanoles@2027';

  try {
    // Create schema if tables don't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
        "locale" TEXT NOT NULL DEFAULT 'es',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionToken_key" ON "sessions"("sessionToken")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "city" TEXT,
        "postalCode" TEXT,
        "country" TEXT,
        "company" TEXT,
        "segment" TEXT,
        "planId" TEXT,
        "subscriptionId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "customers_userId_key" ON "customers"("userId")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" TEXT NOT NULL,
        "nameEs" TEXT NOT NULL,
        "nameEn" TEXT NOT NULL,
        "descriptionEs" TEXT NOT NULL,
        "descriptionEn" TEXT NOT NULL,
        "priceRemote" DOUBLE PRECISION,
        "priceOnSite" DOUBLE PRECISION,
        "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
        "features" TEXT NOT NULL,
        "segment" TEXT NOT NULL,
        "supportRemote" BOOLEAN NOT NULL DEFAULT true,
        "supportOnSite" BOOLEAN NOT NULL DEFAULT true,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "planId" TEXT NOT NULL,
        "serviceMode" TEXT NOT NULL DEFAULT 'REMOTE',
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "endDate" TIMESTAMP(3),
        "stripeSubscriptionId" TEXT,
        "paypalSubscriptionId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_customerId_key" ON "subscriptions"("customerId")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "invoices" (
        "id" TEXT NOT NULL,
        "invoiceNumber" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "subscriptionId" TEXT,
        "amount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "itemDescription" TEXT NOT NULL,
        "dueDate" TIMESTAMP(3) NOT NULL,
        "paidDate" TIMESTAMP(3),
        "pdfUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" TEXT NOT NULL,
        "paymentMethod" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "invoiceId" TEXT,
        "amount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "stripePaymentId" TEXT,
        "paypalOrderId" TEXT,
        "description" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "tickets" (
        "id" TEXT NOT NULL,
        "ticketNumber" TEXT NOT NULL,
        "ticketCode" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'OPEN',
        "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
        "deviceType" TEXT,
        "serviceMode" TEXT NOT NULL DEFAULT 'REMOTE',
        "teamviewerSessionId" TEXT,
        "teamviewerCode" TEXT,
        "teamviewerPassword" TEXT,
        "address" TEXT,
        "city" TEXT,
        "postalCode" TEXT,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "mapPlaceId" TEXT,
        "scheduledDate" TIMESTAMP(3),
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "closedAt" TIMESTAMP(3),
        CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "tickets_ticketNumber_key" ON "tickets"("ticketNumber")`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "tickets_ticketCode_key" ON "tickets"("ticketCode")`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ticket_responses" (
        "id" TEXT NOT NULL,
        "ticketId" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "attachments" TEXT,
        "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ticket_responses_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "channel" TEXT NOT NULL,
        "ticketId" TEXT,
        "invoiceId" TEXT,
        "paymentId" TEXT,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "sentAt" TIMESTAMP(3),
        "readAt" TIMESTAMP(3),
        "failureReason" TEXT,
        "emailMessageId" TEXT,
        "smsMessageId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
      )
    `);

    // Add FK constraints (ignore if already exist)
    const fks = [
      `ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "customers" ADD CONSTRAINT "customers_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      `ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "ticket_responses" ADD CONSTRAINT "ticket_responses_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "notifications" ADD CONSTRAINT "notifications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "notifications" ADD CONSTRAINT "notifications_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "notifications" ADD CONSTRAINT "notifications_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "notifications" ADD CONSTRAINT "notifications_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    ];

    for (const fk of fks) {
      try {
        await prisma.$executeRawUnsafe(fk);
      } catch {
        // Constraint already exists — ignore
      }
    }

    // Create admin user
    const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existing) {
      return NextResponse.json({ message: 'Esquema creado. Admin ya existe', email: existing.email });
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
      data: { email, name, password: hashed, role: 'ADMIN', locale: 'es' },
    });

    return NextResponse.json({ message: 'Esquema creado y admin creado', email: admin.email }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string }).code;
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}
