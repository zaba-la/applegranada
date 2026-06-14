'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileDropzone, type AttachedFile } from '@/components/ui/file-dropzone';
import { AddressPicker, type AddressResult } from '@/components/ui/address-picker';

type FormState = {
  title: string;
  description: string;
  deviceType: string;
  priority: string;
  serviceMode: 'REMOTE' | 'ON_SITE';
  address: string;
  city: string;
  postalCode: string;
};

const EMPTY: FormState = {
  title: '',
  description: '',
  deviceType: 'MAC',
  priority: 'MEDIUM',
  serviceMode: 'REMOTE',
  address: '',
  city: 'Granada',
  postalCode: '',
};

async function uploadFiles(files: AttachedFile[]) {
  if (!files.length) return [];
  const fd = new FormData();
  files.forEach(({ file }) => fd.append('files', file));
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Error al subir los archivos');
  const data = await res.json();
  return data.files as { name: string; url: string; size: number; type: string }[];
}

export default function NewTicketPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ ticketCode: string } | null>(null);

  const set = (key: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleAddress = (result: AddressResult) =>
    setForm((f) => ({
      ...f,
      address: result.address,
      city: result.city || f.city,
      postalCode: result.postalCode || f.postalCode,
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('El título es obligatorio'); return; }
    if (!form.description || form.description === '<p></p>') {
      toast.error('La descripción es obligatoria'); return;
    }
    if (form.serviceMode === 'ON_SITE' && !form.address.trim()) {
      toast.error('La dirección es obligatoria para soporte presencial'); return;
    }

    setLoading(true);
    try {
      const attachments = await uploadFiles(files);
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachments }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al crear el ticket');
      }
      const data = await res.json();
      setDone({ ticketCode: data.ticketCode });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <p className="text-lg font-semibold">¡Ticket creado correctamente!</p>
              <p className="text-3xl font-bold tracking-widest mt-2">{done.ticketCode}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Recibirás un email de confirmación. Nuestro equipo revisará tu solicitud
                y te contactará en menos de 24 horas.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => { setForm(EMPTY); setFiles([]); setDone(null); }}>
                Crear otro ticket
              </Button>
              <Button onClick={() => router.push(`/${locale}/panel/tickets`)}>
                Ver mis tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/${locale}/panel/tickets`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Mis tickets
        </Link>
        <h1 className="text-2xl font-bold">Solicitar soporte</h1>
        <p className="text-muted-foreground">Describe el problema y te ayudamos a resolverlo</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">

        {/* Descripción */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Detalles del problema
          </h2>
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title')(e.target.value)}
              placeholder="Ej: Mi Mac va muy lento desde la última actualización"
            />
          </div>
          <div className="space-y-1">
            <Label>Descripción *</Label>
            <RichTextEditor
              value={form.description}
              onChange={set('description')}
              placeholder="¿Cuándo empezó? ¿Qué mensajes de error ves? ¿Has cambiado algo recientemente?"
            />
          </div>
        </section>

        {/* Modalidad */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Modalidad
          </h2>
          <div className="flex gap-2">
            {([
              { value: 'REMOTE', label: 'Remoto', sub: '19 €/hora · vía TeamViewer' },
              { value: 'ON_SITE', label: 'Presencial', sub: '39 €/hora · mín. 2 horas' },
            ] as const).map(({ value, label, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('serviceMode')(value)}
                className={`flex-1 rounded-lg border px-4 py-3 text-left transition-colors ${
                  form.serviceMode === value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </button>
            ))}
          </div>

          {form.serviceMode === 'ON_SITE' && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">Dirección donde realizaremos el soporte</p>
              <div className="space-y-1">
                <Label>Dirección *</Label>
                <AddressPicker
                  value={form.address}
                  onChange={handleAddress}
                />
              </div>
              {(form.city || form.postalCode) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Ciudad</Label>
                    <Input value={form.city} onChange={(e) => set('city')(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Código postal</Label>
                    <Input value={form.postalCode} onChange={(e) => set('postalCode')(e.target.value)} maxLength={5} />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Clasificación */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Clasificación
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Dispositivo *</Label>
              <Select value={form.deviceType} onValueChange={set('deviceType')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAC">Mac</SelectItem>
                  <SelectItem value="IPAD">iPad</SelectItem>
                  <SelectItem value="IPHONE">iPhone</SelectItem>
                  <SelectItem value="APPLE_TV">Apple TV</SelectItem>
                  <SelectItem value="MULTIPLE">Múltiples dispositivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Urgencia</Label>
              <Select value={form.priority} onValueChange={set('priority')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja — cuando puedas</SelectItem>
                  <SelectItem value="MEDIUM">Media — esta semana</SelectItem>
                  <SelectItem value="HIGH">Alta — urgente</SelectItem>
                  <SelectItem value="URGENT">Crítica — lo antes posible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Adjuntos */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Archivos adjuntos <span className="text-muted-foreground font-normal normal-case">(opcional)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Capturas de pantalla, fotos del error, logs... Cualquier cosa que ayude a entender el problema.
          </p>
          <FileDropzone files={files} onChange={setFiles} />
        </section>

        {/* Acciones */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
          </Button>
        </div>
      </form>
    </div>
  );
}
