'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, getStatusColor } from '@/lib/utils';

type Ticket = {
  id: string;
  ticketCode: string;
  title: string;
  priority: string;
  status: string;
  deviceType: string | null;
  createdAt: Date | string;
  customer: { user: { name: string; email: string } };
};

export function TicketsTable({ tickets, locale, labels }: {
  tickets: Ticket[];
  locale: string;
  labels: { code: string; customer: string; priority: string; status: string; device: string; created: string };
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labels.code}</TableHead>
          <TableHead>{labels.customer}</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>{labels.priority}</TableHead>
          <TableHead>{labels.status}</TableHead>
          <TableHead>{labels.device}</TableHead>
          <TableHead>{labels.created}</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow
            key={ticket.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => router.push(`/${locale}/admin/tickets/${ticket.id}`)}
          >
            <TableCell className="font-mono text-xs">{ticket.ticketCode}</TableCell>
            <TableCell className="text-sm">{ticket.customer.user.name}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm">{ticket.title}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(ticket.priority)}>{ticket.priority}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{ticket.deviceType}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{formatDate(ticket.createdAt)}</TableCell>
            <TableCell className="text-muted-foreground text-sm">Ver →</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
