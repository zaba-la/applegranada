import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { TicketsTable } from '@/components/admin/tickets-table';

export const metadata = { title: 'Tickets' };

export default async function AdminTicketsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('admin.tickets');

  const tickets = await prisma.ticket.findMany({
    include: {
      customer: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const labels = {
    code: t('code'),
    customer: t('customer'),
    priority: t('priority'),
    status: t('status'),
    device: t('device'),
    created: t('created'),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{tickets.length} tickets en total</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/tickets/nuevo`}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo ticket
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <TicketsTable tickets={tickets} locale={locale} labels={labels} />
        </CardContent>
      </Card>
    </div>
  );
}
