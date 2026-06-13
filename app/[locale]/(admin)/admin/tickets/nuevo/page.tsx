import { unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { CreateTicketForm } from '@/components/admin/create-ticket-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'Nuevo ticket — Admin' };

export default async function NuevoTicketPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  const customers = await prisma.customer.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const customerList = customers.map((c) => ({
    id: c.id,
    name: c.user.name,
    email: c.user.email,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/${locale}/admin/tickets`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a tickets
        </Link>
        <h1 className="text-2xl font-bold">Nuevo ticket de soporte</h1>
        <p className="text-muted-foreground">
          Se enviará un correo al cliente con las instrucciones de pago.
        </p>
      </div>

      <CreateTicketForm customers={customerList} locale={locale} />
    </div>
  );
}
