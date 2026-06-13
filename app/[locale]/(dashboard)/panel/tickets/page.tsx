import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: 'Mis tickets' };

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  WAITING_CUSTOMER: 'Esperando tu respuesta',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_CUSTOMER: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-muted text-muted-foreground',
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', URGENT: 'Urgente',
};

const DEVICE_LABEL: Record<string, string> = {
  MAC: 'Mac', IPAD: 'iPad', IPHONE: 'iPhone', APPLE_TV: 'Apple TV', MULTIPLE: 'Múltiples',
};

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
        include: { _count: { select: { responses: true } } },
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
            <Link key={ticket.id} href={`/${locale}/panel/tickets/${ticket.id}`}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold">{ticket.ticketCode}</span>
                        <Badge className={STATUS_COLOR[ticket.status] ?? 'bg-muted text-muted-foreground'}>
                          {STATUS_LABEL[ticket.status] ?? ticket.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
                        </Badge>
                      </div>
                      <p className="font-medium truncate">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {DEVICE_LABEL[ticket.deviceType ?? ''] ?? ticket.deviceType}
                        {' · '}
                        {ticket.serviceMode === 'REMOTE' ? 'Remoto' : 'Presencial'}
                        {' · '}
                        {formatDate(ticket.createdAt)}
                        {ticket._count.responses > 0 && (
                          <span className="ml-2 font-medium text-foreground">
                            {ticket._count.responses} {ticket._count.responses === 1 ? 'mensaje' : 'mensajes'}
                          </span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
