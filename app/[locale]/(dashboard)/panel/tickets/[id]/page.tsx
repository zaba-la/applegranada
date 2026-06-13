import { notFound, redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerTicketDetail } from '@/components/panel/ticket-detail';
import { StripeSuccessHandler } from '@/components/panel/stripe-success-handler';

type Props = { params: { locale: string; id: string }; searchParams: { pago?: string; session_id?: string } };

export async function generateMetadata({ params }: Props) {
  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  return { title: ticket ? `${ticket.ticketCode} — Mis tickets` : 'Ticket' };
}

export default async function CustomerTicketDetailPage({ params: { locale, id }, searchParams }: Props) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/login`);

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session.user!.email! } },
  });
  if (!customer) notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      responses: { orderBy: { createdAt: 'asc' } },
      payments: { where: { status: 'COMPLETED' }, take: 1 },
    },
  });

  if (!ticket || ticket.customerId !== customer.id) notFound();

  const isPaid = ticket.payments.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/${locale}/panel/tickets`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Mis tickets
        </Link>
      </div>

      {/* Handle Stripe success redirect */}
      {searchParams.pago === 'exitoso' && searchParams.session_id && (
        <StripeSuccessHandler ticketId={id} sessionId={searchParams.session_id} />
      )}

      <CustomerTicketDetail ticket={{ ...ticket, isPaid }} />
    </div>
  );
}
