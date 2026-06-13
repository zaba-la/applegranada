import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('code')}</TableHead>
                <TableHead>{t('customer')}</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>{t('priority')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('device')}</TableHead>
                <TableHead>{t('created')}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.ticketCode}</TableCell>
                  <TableCell className="text-sm">{ticket.customer.user.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{ticket.deviceType}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${locale}/admin/tickets/${ticket.id}`}>{t('respond')}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
