import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: 'Mis tickets' };

export default async function TicketsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations('dashboard.tickets');

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session!.user.email } },
  });

  const tickets = customer
    ? await prisma.ticket.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/panel/tickets/nuevo`}>
            <Plus className="h-4 w-4 mr-2" />
            {t('new')}
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{t('empty')}</p>
            <Button asChild>
              <Link href={`/${locale}/panel/tickets/nuevo`}>{t('new')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">{ticket.ticketCode}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Badge className={`${getStatusColor(ticket.priority)} ml-1`}>{ticket.priority}</Badge>
                    </div>
                    <p className="font-medium truncate">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.deviceType} · {ticket.serviceMode} · {formatDate(ticket.createdAt)}
                    </p>
                    {ticket.teamviewerCode && (
                      <p className="text-xs text-blue-600 mt-1">
                        {t('trackYourTicket')}: <span className="font-mono">{ticket.ticketCode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
