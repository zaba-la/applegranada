import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Tag, Ticket, CreditCard } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ResendInviteButton } from '@/components/admin/resend-invite-button';

type Props = { params: { locale: string; id: string } };

export async function generateMetadata({ params }: Props) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } } },
  });
  return { title: customer ? `${customer.user.name} — Clientes` : 'Cliente' };
}

const SEGMENT_LABEL: Record<string, string> = {
  STUDENT: 'Estudiante', HOME: 'Hogar', PROFESSIONAL: 'Profesional',
  BUSINESS: 'Empresa', NONE: 'Sin segmento',
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Abierto', IN_PROGRESS: 'En progreso', WAITING_CUSTOMER: 'Esperando cliente',
  RESOLVED: 'Resuelto', CLOSED: 'Cerrado',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_CUSTOMER: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const PAYMENT_STATUS: Record<string, string> = {
  PENDING: 'Pendiente', COMPLETED: 'Completado', FAILED: 'Fallido',
  PROCESSING: 'Procesando', REFUNDED: 'Reembolsado',
};

export default async function AdminCustomerDetailPage({ params: { locale, id } }: Props) {
  unstable_setRequestLocale(locale);

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      tickets: {
        orderBy: { createdAt: 'desc' },
        include: { payments: { where: { status: 'COMPLETED' }, take: 1 } },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!customer) notFound();

  const totalPagado = customer.payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href={`/${locale}/admin/clientes`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Clientes
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{customer.user.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{customer.user.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {customer.segment && (
            <Badge variant="outline">{SEGMENT_LABEL[customer.segment] ?? customer.segment}</Badge>
          )}
          <ResendInviteButton customerId={customer.id} />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Tickets', value: customer.tickets.length, icon: Ticket },
          { label: 'Total pagado', value: formatCurrency(totalPagado), icon: CreditCard },
          { label: 'Cliente desde', value: formatDate(customer.user.createdAt), icon: Calendar },
          { label: 'Segmento', value: SEGMENT_LABEL[customer.segment ?? 'NONE'] ?? '—', icon: Tag },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos de contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <a href={`mailto:${customer.user.email}`} className="hover:underline">{customer.user.email}</a>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
            </div>
          )}
          {(customer.address || customer.city) && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{[customer.address, customer.city, customer.postalCode].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {customer.company && (
            <div className="flex items-center gap-3 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{customer.company}</span>
            </div>
          )}
          {!customer.phone && !customer.address && !customer.company && (
            <p className="text-sm text-muted-foreground">Sin datos adicionales de contacto.</p>
          )}
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tickets ({customer.tickets.length})</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/admin/tickets?cliente=${customer.id}`}>Ver en tickets</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {customer.tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-4">Sin tickets.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs">{ticket.ticketCode}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLOR[ticket.status] ?? 'bg-muted'}>
                        {STATUS_LABEL[ticket.status] ?? ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.payments.length > 0
                        ? <Badge className="bg-green-100 text-green-800">Sí</Badge>
                        : <span className="text-xs text-muted-foreground">No</span>
                      }
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/admin/tickets/${ticket.id}`}>Ver</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payments */}
      {customer.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos pagos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">{payment.paymentMethod}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{PAYMENT_STATUS[payment.status] ?? payment.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {payment.description ?? '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</TableCell>
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
