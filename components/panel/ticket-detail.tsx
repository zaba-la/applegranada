'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, Loader2, Paperclip, ShieldCheck, User, Laptop, MapPin, Smartphone, Tablet, Tv, Layers } from 'lucide-react';
import { AttachmentGallery } from '@/components/ui/attachment-gallery';
import { PayTicketButton } from '@/components/panel/pay-ticket-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileDropzone, type AttachedFile } from '@/components/ui/file-dropzone';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Attachment = { name: string; url: string; size: number; type: string };

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
  isPaid: boolean;
  createdAt: Date | string;
  responses: Response[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  WAITING_CUSTOMER: 'Esperando tu respuesta',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_CUSTOMER: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-muted text-muted-foreground',
};

const DEVICE_ICON: Record<string, React.ElementType> = {
  MAC: Laptop, IPAD: Tablet, IPHONE: Smartphone, APPLE_TV: Tv, MULTIPLE: Layers,
};

const DEVICE_LABEL: Record<string, string> = {
  MAC: 'Mac', IPAD: 'iPad', IPHONE: 'iPhone', APPLE_TV: 'Apple TV', MULTIPLE: 'Múltiples',
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', URGENT: 'Urgente',
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

// ─── Attachment list ──────────────────────────────────────────────────────────
function AttachmentList({ raw }: { raw: string | null }) {
  return <AttachmentGallery raw={raw} />;
}

// ─── Comment bubble (customer perspective: client=right, admin=left) ──────────
function CommentBubble({ response }: { response: Response }) {
  const isCustomer = !response.isFromAdmin; // customer sees their own msgs on the right
  return (
    <div className={cn('flex gap-3', isCustomer ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        isCustomer ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {response.isFromAdmin
          ? <ShieldCheck className="h-4 w-4" />
          : <User className="h-4 w-4" />
        }
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[80%] space-y-1')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm',
          isCustomer
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted'
        )}>
          <div
            className="prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            dangerouslySetInnerHTML={{ __html: response.message }}
          />
          <AttachmentList raw={response.attachments} />
        </div>
        <p className={cn(
          'text-xs text-muted-foreground',
          isCustomer ? 'text-right' : 'text-left'
        )}>
          {response.isFromAdmin ? 'Técnico' : 'Tú'} · {formatTs(response.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CustomerTicketDetail({ ticket: initial }: { ticket: Ticket }) {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>(initial.responses);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [sending, setSending] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const isClosed = initial.status === 'CLOSED' || initial.status === 'RESOLVED';
  const DeviceIcon = DEVICE_ICON[initial.deviceType ?? 'MAC'] ?? Laptop;

  const sendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || message === '<p></p>') {
      toast.error('Escribe un mensaje antes de enviar');
      return;
    }
    setSending(true);
    try {
      const attachments = await uploadFiles(files);
      const res = await fetch(`/api/tickets/${initial.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          attachments: attachments.length ? attachments : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Error al enviar');
      }
      const newResponse = await res.json();
      setResponses((prev) => [...prev, newResponse]);
      setMessage('');
      setFiles([]);
      setShowDropzone(false);
      toast.success('Mensaje enviado');
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
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-lg">{initial.ticketCode}</span>
          <Badge className={STATUS_COLOR[initial.status] ?? 'bg-muted text-muted-foreground'}>
            {STATUS_LABEL[initial.status] ?? initial.status}
          </Badge>
          <Badge variant="outline">{PRIORITY_LABEL[initial.priority] ?? initial.priority}</Badge>
          {(initial.status === 'OPEN' || initial.status === 'IN_PROGRESS') && !initial.isPaid && (
            <PayTicketButton
              ticketId={initial.id}
              ticketCode={initial.ticketCode}
              serviceMode={initial.serviceMode}
            />
          )}
          {initial.isPaid && (
            <Badge className="bg-green-100 text-green-800">Pago confirmado</Badge>
          )}
        </div>
        <h1 className="text-xl font-semibold">{initial.title}</h1>
        <p className="text-sm text-muted-foreground">
          {initial.ticketNumber} · Abierto el {formatTs(initial.createdAt)}
        </p>
      </div>

      {/* Service info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Detalles del servicio</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
            <span>{DEVICE_LABEL[initial.deviceType ?? ''] ?? initial.deviceType}</span>
          </div>
          <div className="flex items-center gap-2">
            {initial.serviceMode === 'REMOTE'
              ? <Laptop className="h-4 w-4 text-muted-foreground" />
              : <MapPin className="h-4 w-4 text-muted-foreground" />
            }
            <span>
              {initial.serviceMode === 'REMOTE'
                ? 'Soporte remoto · 19€/h · mínimo 1 hora'
                : 'Soporte presencial · 39€/h · mínimo 2 horas'}
            </span>
          </div>
          {initial.address && (
            <p className="text-muted-foreground">
              {initial.address}{initial.city ? `, ${initial.city}` : ''}
              {initial.postalCode ? ` ${initial.postalCode}` : ''}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Original description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Tu descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="text-sm prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            dangerouslySetInnerHTML={{ __html: initial.description }}
          />
          <AttachmentList raw={initial.attachments} />
        </CardContent>
      </Card>

      {/* Comment log */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Conversación
        </h2>

        {responses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Aún no hay mensajes. Te responderemos pronto.
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
      {isClosed ? (
        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground text-center">
          Este ticket está {STATUS_LABEL[initial.status]?.toLowerCase()}. Si necesitas más ayuda, abre un ticket nuevo.
        </div>
      ) : (
        <form onSubmit={sendResponse} className="space-y-3 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Enviar mensaje
          </h2>

          <RichTextEditor
            value={message}
            onChange={setMessage}
            placeholder="Escribe tu mensaje al técnico..."
          />

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

          <div className="flex justify-end">
            <Button type="submit" disabled={sending}>
              {sending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
                : <><Send className="mr-2 h-4 w-4" />Enviar mensaje</>
              }
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
