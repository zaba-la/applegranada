import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { CreateCustomerDialog } from '@/components/admin/create-customer-dialog';

export const metadata = { title: 'Clientes' };

export default async function AdminCustomersPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('admin.customers');

  const customers = await prisma.customer.findMany({
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      _count: { select: { tickets: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const segmentLabel: Record<string, string> = {
    STUDENT: 'Estudiante', HOME: 'Hogar', PROFESSIONAL: 'Profesional', BUSINESS: 'Empresa', NONE: 'No disponible',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{customers.length} clientes registrados</p>
        </div>
        <CreateCustomerDialog />
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('segment')}</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>{t('createdAt')}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.user.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{customer.user.email}</TableCell>
                    <TableCell>
                      {customer.segment && (
                        <Badge variant="outline">{segmentLabel[customer.segment] ?? customer.segment}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{customer._count.tickets}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/admin/clientes/${customer.id}`}>Ver</Link>
                      </Button>
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
