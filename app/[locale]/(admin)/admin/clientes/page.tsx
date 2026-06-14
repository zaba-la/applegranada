import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CreateCustomerDialog } from '@/components/admin/create-customer-dialog';
import { CustomersTable } from '@/components/admin/customers-table';

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

  const labels = {
    name: t('name'),
    email: t('email'),
    segment: t('segment'),
    createdAt: t('createdAt'),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            <CustomersTable customers={customers} locale={locale} labels={labels} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
