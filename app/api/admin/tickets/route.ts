import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateTicketCode, generateTicketNumber } from '@/lib/ticket-utils';
import { sendEmail, ticketCreatedEmailHtml } from '@/lib/email';
import { z } from 'zod';

const AdminCreateTicketSchema = z.object({
  customerId: z.string().min(1, 'El cliente es obligatorio'),
  title: z.string().min(5).max(200),
  description: z.string().min(1),
  serviceMode: z.enum(['REMOTE', 'ON_SITE']).default('REMOTE'),
  deviceType: z.enum(['MAC', 'IPAD', 'IPHONE', 'APPLE_TV', 'MULTIPLE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = AdminCreateTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: parsed.data.customerId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!customer) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
  }

  const ticketCount = await prisma.ticket.count();
  const ticketCode = generateTicketCode();
  const ticketNumber = generateTicketNumber(ticketCount + 1);

  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      ticketCode,
      customerId: parsed.data.customerId,
      title: parsed.data.title,
      description: parsed.data.description,
      deviceType: parsed.data.deviceType,
      priority: parsed.data.priority,
      serviceMode: parsed.data.serviceMode,
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      attachments: parsed.data.attachments
        ? JSON.stringify(parsed.data.attachments)
        : undefined,
    },
  });

  // Send email to customer
  const hourlyRate = parsed.data.serviceMode === 'REMOTE' ? 19 : 39;
  try {
    await sendEmail(
      customer.user.email,
      `Ticket de soporte abierto — ${ticketCode}`,
      ticketCreatedEmailHtml({
        customerName: customer.user.name,
        ticketCode,
        ticketTitle: parsed.data.title,
        serviceMode: parsed.data.serviceMode,
        hourlyRate,
      })
    );
  } catch (err) {
    console.error('[ticket] Error enviando correo:', err);
  }

  return NextResponse.json({ ...ticket, customerEmail: customer.user.email }, { status: 201 });
}
