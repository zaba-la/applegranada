import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = { title: 'Mis facturas' };

export default async function InvoicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations('dashboard.invoices');

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session!.user.email } },
  });

  const invoices = customer
    ? await prisma.invoice.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">{t('empty')}</CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{invoices.length} facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('number')}</TableHead>
                  <TableHead>{t('amount')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('dueDate')}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>
                      {invoice.pdfUrl && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={invoice.pdfUrl} target="_blank" rel="noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
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
