'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Send, Loader2, Paperclip, ShieldCheck, User,
  Laptop, MapPin, Smartphone, Tablet, Tv, Layers,
  CreditCard, Bell,
} from 'lucide-react';
import { AttachmentGallery } from '@/components/ui/attachment-gallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileDropzone, type AttachedFile } from '@/components/ui/file-dropzone';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Attachment = { name: string; url: string; size: number; type: string };

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  description: string | null;
  createdAt: Date | string;
};

type Response = {
  id: string;
  message: string;
  isFromAdmin: boolean;
  attachments: string | null;
  createdAt: Date | string;
};

type Ticket = {
  id: string;
  ticketCode: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deviceType: string | null;
  serviceMode: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  attachments: string | null;
  estimatedHours: number | null;
  createdAt: Date | string;
  customer: { user: { name: string; email: string } };
  responses: Response[];
  payments: Payment[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'WAITING_CUSTOMER', label: 'Esperando cliente' },
  { value: 'RESOLVED', label: 'Resuelto' },
  { value: 'CLOSED', label: 'Cerrado' },
];

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  WAITING_CUSTOMER: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CLOSED: 'bg-muted text-muted-foreground',
};

const DEVICE_ICON: Record<string, React.ElementType> = {
  MAC: Laptop, IPAD: Tablet, IPHONE: Smartphone, APPLE_TV: Tv, MULTIPLE: Layers,
};

const DEVICE_LABEL: Record<string, string> = {
  MAC: 'Mac', IPAD: 'iPad', IPHONE: 'iPhone', APPLE_TV: 'Apple TV', MULTIPLE: 'Múltiples',
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', URGENT: 'Urgente',
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED:  'bg-green-100 text-green-800',
  FAILED:     'bg-red-100 text-red-800',
  REFUNDED:   'bg-slate-100 text-slate-700',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', PROCESSING: 'Procesando',
  COMPLETED: 'Completado', FAILED: 'Fallido', REFUNDED: 'Reembolsado',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  STRIPE: 'Tarjeta', PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Transferencia', BIZUM: 'Bizum',
};

function formatTs(d: Date | string) {
  return format(new Date(d), "d 'de' MMMM 'a las' HH:mm", { locale: es });
}

function parseAttachments(raw: string | null): Attachment[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as Attachment[]; } catch { return []; }
}

async function uploadFiles(files: AttachedFile[]) {
  if (!files.length) return [];
  const fd = new FormData();
  files.forEach(({ file }) => fd.append('files', file));
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Error al subir archivos');
  return (await res.json()).files as Attachment[];
}

const AttachmentList = ({ raw }: { raw: string | null }) => <AttachmentGallery raw={raw} />;

// ─── Comment bubble ───────────────────────────────────────────────────────────
function CommentBubble({ response }: { response: Response }) {
  const isAdmin = response.isFromAdmin;
  return (
    <div className={cn('flex gap-3', isAdmin ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[80%] space-y-1', isAdmin ? 'items-end' : 'items-start')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm',
          isAdmin
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted'
        )}>
          {/* Render HTML from WYSIWYG */}
          <div
            className="prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            dangerouslySetInnerHTML={{ __html: response.message }}
          />
          <AttachmentList raw={response.attachments} />
        </div>
        <p className={cn(
          'text-xs text-muted-foreground',
          isAdmin ? 'text-right' : 'text-left'
        )}>
          {isAdmin ? 'Técnico' : 'Cliente'} · {formatTs(response.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TicketDetail({ ticket: initial, locale }: { ticket: Ticket; locale: string }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initial);
  const [responses, setResponses] = useState<Response[]>(initial.responses);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [newStatus, setNewStatus] = useState(initial.status);
  const [sending, setSending] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const DeviceIcon = DEVICE_ICON[ticket.deviceType ?? 'MAC'] ?? Laptop;
  const lastPayment = ticket.payments?.[0] ?? null;
  const hourlyRate = ticket.serviceMode === 'REMOTE' ? 19 : 39;

  const sendReminder = async () => {
    setSendingReminder(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}/payment-reminder`, { method: 'POST' });
      if (!res.ok) throw new Error('Error al enviar');
      toast.success('Recordatorio de pago enviado al cliente');
    } catch {
      toast.error('Error al enviar el recordatorio');
    } finally {
      setSendingReminder(false);
    }
  };

  const sendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || message === '<p></p>') {
      toast.error('Escribe un mensaje antes de enviar');
      return;
    }
    setSending(true);
    try {
      const attachments = await uploadFiles(files);
      const statusChanged = newStatus !== ticket.status;
      const res = await fetch(`/api/tickets/${ticket.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          attachments: attachments.length ? attachments : undefined,
          newStatus: statusChanged ? newStatus : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Error al enviar');
      }
      const newResponse = await res.json();
      setResponses((prev) => [...prev, newResponse]);
      setTicket((t) => ({ ...t, status: newStatus }));
      setMessage('');
      setFiles([]);
      setShowDropzone(false);
      toast.success('Respuesta enviada · email notificado al cliente');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-lg font-bold">{ticket.ticketCode}</span>
            <Badge className={STATUS_COLOR[ticket.status]}>
              {STATUS_OPTIONS.find((s) => s.value === ticket.status)?.label ?? ticket.status}
            </Badge>
            <Badge className={PRIORITY_COLOR[ticket.priority]}>
              {PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
            </Badge>
          </div>
          <h1 className="mt-1 text-xl font-semibold">{ticket.title}</h1>
          <p className="text-sm text-muted-foreground">{ticket.ticketNumber} · {formatTs(ticket.createdAt)}</p>
        </div>

        {/* Status changer */}
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground shrink-0">Cambiar estado</Label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{ticket.customer.user.name}</p>
            <p className="text-muted-foreground">{ticket.customer.user.email}</p>
          </CardContent>
        </Card>

        {/* Service details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Servicio</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <DeviceIcon className="h-4 w-4 text-muted-foreground" />
              <span>{DEVICE_LABEL[ticket.deviceType ?? ''] ?? ticket.deviceType}</span>
            </div>
            <div className="flex items-center gap-2">
              {ticket.serviceMode === 'REMOTE'
                ? <Laptop className="h-4 w-4 text-muted-foreground" />
                : <MapPin className="h-4 w-4 text-muted-foreground" />
              }
              <span>{ticket.serviceMode === 'REMOTE' ? 'Remoto · TeamViewer' : 'Presencial'}</span>
            </div>
            {ticket.address && (
              <p className="text-muted-foreground pt-1">
                {ticket.address}{ticket.city ? `, ${ticket.city}` : ''}
                {ticket.postalCode ? ` ${ticket.postalCode}` : ''}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Pago
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={sendReminder}
              disabled={sendingReminder}
              className="h-7 gap-1.5 text-xs"
            >
              {sendingReminder
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <Bell className="h-3 w-3" />
              }
              Enviar recordatorio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lastPayment ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado</span>
                <Badge className={PAYMENT_STATUS_COLOR[lastPayment.status]}>
                  {PAYMENT_STATUS_LABEL[lastPayment.status] ?? lastPayment.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Importe</span>
                <span className="font-semibold">{lastPayment.amount.toFixed(2)} {lastPayment.currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Método</span>
                <span>{PAYMENT_METHOD_LABEL[lastPayment.paymentMethod] ?? lastPayment.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span>{formatTs(lastPayment.createdAt)}</span>
              </div>
              {lastPayment.description && (
                <p className="text-muted-foreground text-xs pt-1">{lastPayment.description}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Sin pagos registrados</p>
                <p className="text-xs text-muted-foreground">
                  {ticket.serviceMode === 'REMOTE' ? '19 €/hora · mín. 1 hora' : '39 €/hora · mín. 2 horas'}
                  {ticket.estimatedHours ? ` · ${ticket.estimatedHours}h contratadas (${(ticket.estimatedHours * hourlyRate).toFixed(0)} €)` : ''}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Original description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Descripción del problema</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="text-sm prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
          <AttachmentList raw={ticket.attachments} />
        </CardContent>
      </Card>

      {/* Comment log */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Historial de comunicación
        </h2>

        {responses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Sin mensajes aún. Añade el primer comentario.
          </p>
        ) : (
          <div className="space-y-4 py-2">
            {responses.map((r) => (
              <CommentBubble key={r.id} response={r} />
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      <form onSubmit={sendResponse} className="space-y-3 border-t pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Añadir comentario
        </h2>

        <RichTextEditor
          value={message}
          onChange={setMessage}
          placeholder="Escribe tu respuesta al cliente..."
        />

        {/* Toggle dropzone */}
        <button
          type="button"
          onClick={() => setShowDropzone((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Paperclip className="h-3.5 w-3.5" />
          {showDropzone ? 'Ocultar adjuntos' : 'Adjuntar archivos'}
          {files.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
              {files.length}
            </span>
          )}
        </button>

        {showDropzone && <FileDropzone files={files} onChange={setFiles} />}

        <div className="flex items-center justify-between">
          {newStatus !== ticket.status && (
            <p className="text-xs text-muted-foreground">
              El estado cambiará a{' '}
              <strong>{STATUS_OPTIONS.find((s) => s.value === newStatus)?.label}</strong>
              {' '}al enviar
            </p>
          )}
          <div className="ml-auto">
            <Button type="submit" disabled={sending}>
              {sending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
                : <><Send className="mr-2 h-4 w-4" />Enviar y notificar</>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
