import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Ticket, FileText, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

export const metadata = { title: 'Mi panel' };

export default async function PanelPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations('dashboard');

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session!.user.email } },
    include: {
      plan: true,
      subscription: true,
      tickets: { orderBy: { createdAt: 'desc' }, take: 5 },
      invoices: { orderBy: { createdAt: 'desc' }, take: 3 },
    },
  });

  const stats = [
    {
      label: 'Tickets abiertos',
      value: customer?.tickets.filter((t) => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length ?? 0,
      icon: Ticket,
    },
    {
      label: 'Total tickets',
      value: customer?.tickets.length ?? 0,
      icon: Clock,
    },
    {
      label: 'Facturas pendientes',
      value: customer?.invoices.filter((i) => i.status === 'PENDING').length ?? 0,
      icon: FileText,
    },
    {
      label: 'Plan activo',
      value: customer?.plan ? (locale === 'es' ? customer.plan.nameEs : customer.plan.nameEn) : 'Sin plan',
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">Bienvenido, {session!.user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent tickets */}
      {customer?.tickets && customer.tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('tickets.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customer.tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.ticketCode} · {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent invoices */}
      {customer?.invoices && customer.invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('invoices.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customer.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(invoice.amount)}</span>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!customer && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Tu cuenta aún no tiene perfil de cliente asociado. Contacta con nosotros para activar tu plan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
