import { prisma } from '@/lib/prisma';
import { unstable_setRequestLocale } from 'next-intl/server';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export const metadata = { title: 'Pagos — Admin' };

const METHOD_LABEL: Record<string, string> = {
  STRIPE: 'Stripe (tarjeta)',
  PAYPAL: 'PayPal',
  BIZUM: 'Bizum',
  BANK_TRANSFER: 'Transferencia',
  CASH: 'Efectivo',
};

const STATUS_LABEL_ES: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Notificado',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
};

export default async function AdminPagosPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  const payments = await prisma.payment.findMany({
    include: {
      customer: { include: { user: { select: { name: true, email: true } } } },
      invoice: { select: { invoiceNumber: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalCobrado = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + p.amount, 0);
  const totalPendiente = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0);
  const totalFallido = payments.filter((p) => p.status === 'FAILED').length;

  const stats = [
    {
      label: 'Total cobrado',
      value: formatCurrency(totalCobrado),
      icon: TrendingUp,
      sub: `${payments.filter((p) => p.status === 'COMPLETED').length} pagos completados`,
    },
    {
      label: 'Pendiente de cobro',
      value: formatCurrency(totalPendiente),
      icon: Clock,
      sub: `${payments.filter((p) => p.status === 'PENDING').length} pagos pendientes`,
    },
    {
      label: 'Pagos fallidos',
      value: totalFallido,
      icon: AlertCircle,
      sub: 'Requieren atención',
    },
    {
      label: 'Total pagos',
      value: payments.length,
      icon: CreditCard,
      sub: 'Todos los registros',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pagos</h1>
        <p className="text-muted-foreground">{payments.length} pagos registrados</p>
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
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No hay pagos registrados</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{payment.customer.user.name}</p>
                      <p className="text-xs text-muted-foreground">{payment.customer.user.email}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {METHOD_LABEL[payment.paymentMethod] ?? payment.paymentMethod}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>{STATUS_LABEL_ES[payment.status] ?? payment.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {payment.invoice?.invoiceNumber ?? '—'}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                      {payment.description ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
