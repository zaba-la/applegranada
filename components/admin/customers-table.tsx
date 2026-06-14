'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

type Customer = {
  id: string;
  segment: string | null;
  createdAt: Date | string;
  user: { name: string; email: string; createdAt: Date | string };
  _count: { tickets: number };
};

const SEGMENT_LABEL: Record<string, string> = {
  STUDENT: 'Estudiante', HOME: 'Hogar', PROFESSIONAL: 'Profesional', BUSINESS: 'Empresa', NONE: 'No disponible',
};

export function CustomersTable({ customers, locale, labels }: {
  customers: Customer[];
  locale: string;
  labels: { name: string; email: string; segment: string; createdAt: string };
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labels.name}</TableHead>
          <TableHead>{labels.email}</TableHead>
          <TableHead>{labels.segment}</TableHead>
          <TableHead>Tickets</TableHead>
          <TableHead>{labels.createdAt}</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => router.push(`/${locale}/admin/clientes/${customer.id}`)}
          >
            <TableCell className="font-medium">{customer.user.name}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{customer.user.email}</TableCell>
            <TableCell>
              {customer.segment && (
                <Badge variant="outline">{SEGMENT_LABEL[customer.segment] ?? customer.segment}</Badge>
              )}
            </TableCell>
            <TableCell>{customer._count.tickets}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{formatDate(customer.createdAt)}</TableCell>
            <TableCell className="text-muted-foreground text-sm">Ver →</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
