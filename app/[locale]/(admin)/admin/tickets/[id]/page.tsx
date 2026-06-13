import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { TicketDetail } from '@/components/admin/ticket-detail';

type Props = { params: { locale: string; id: string } };

export async function generateMetadata({ params }: Props) {
  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  return { title: ticket ? `${ticket.ticketCode} — Admin` : 'Ticket' };
}

export default async function AdminTicketDetailPage({ params: { locale, id } }: Props) {
  unstable_setRequestLocale(locale);

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      customer: { include: { user: { select: { name: true, email: true } } } },
      responses: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/${locale}/admin/tickets`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a tickets
        </Link>
      </div>
      <TicketDetail ticket={ticket} locale={locale} />
    </div>
  );
}
