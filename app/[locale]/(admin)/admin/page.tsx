import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Users, Ticket, FileText, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Panel de administración' };

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('admin');

  const [customerCount, ticketCount, invoiceStats, paymentsTotal] = await Promise.all([
    prisma.customer.count(),
    prisma.ticket.count(),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
  ]);

  const openTickets = await prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } });
  const pendingInvoices = await prisma.invoice.count({ where: { status: 'PENDING' } });

  const totalCobrado = (invoiceStats._sum.amount ?? 0) + (paymentsTotal._sum.amount ?? 0);

  const stats = [
    { label: 'Clientes totales', value: customerCount, icon: Users, sub: `${ticketCount} tickets en total` },
    { label: 'Tickets abiertos', value: openTickets, icon: Ticket, sub: 'En curso o pendientes' },
    { label: 'Facturas pendientes', value: pendingInvoices, icon: FileText, sub: 'Pendientes de pago' },
    { label: 'Ingresos cobrados', value: formatCurrency(totalCobrado), icon: CreditCard, sub: 'Total cobrado' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">Resumen general del negocio</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
