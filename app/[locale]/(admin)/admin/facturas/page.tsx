import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = { title: 'Facturas' };

export default async function AdminInvoicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('admin.invoices');

  const invoices = await prisma.invoice.findMany({
    include: {
      customer: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{invoices.length} facturas</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('number')}</TableHead>
                <TableHead>{t('customer')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>Vencimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-sm">{invoice.customer.user.name}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
