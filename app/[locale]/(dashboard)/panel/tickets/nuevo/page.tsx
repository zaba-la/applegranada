'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ChevronLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
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
  estimatedHours: number;
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
  estimatedHours: 1,
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
  const [payLoading, setPayLoading] = useState<'stripe' | 'paypal' | null>(null);
  const [done, setDone] = useState<{
    ticketId: string;
    ticketCode: string;
    estimatedHours: number;
    serviceMode: 'REMOTE' | 'ON_SITE';
  } | null>(null);

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
      setDone({
        ticketId: data.id,
        ticketCode: data.ticketCode,
        estimatedHours: form.estimatedHours,
        serviceMode: form.serviceMode,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const hourlyRate = done.serviceMode === 'ON_SITE' ? 39 : 19;
    const price = done.estimatedHours * hourlyRate;

    async function handlePayment(method: 'stripe' | 'paypal') {
      setPayLoading(method);
      const endpoint =
        method === 'stripe' ? '/api/payments/ticket' : '/api/payments/paypal/ticket';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: done!.ticketId }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          window.location.href = data.url;
        } else {
          toast.error(data.error ?? 'Error al iniciar el pago');
          setPayLoading(null);
        }
      } catch {
        toast.error('Error de red al iniciar el pago');
        setPayLoading(null);
      }
    }

    return (
      <div className="max-w-lg space-y-4">
        {/* Ticket creado */}
        <Card>
          <CardContent className="pt-8 pb-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <p className="text-lg font-semibold">¡Ticket creado correctamente!</p>
              <p className="text-3xl font-bold tracking-widest mt-1">{done.ticketCode}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Recibirás un email de confirmación en breve.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pago */}
        <Card>
          <CardContent className="pt-6 pb-6 space-y-4">
            <div>
              <p className="text-base font-semibold">Completa tu pago</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                El soporte se activa una vez confirmado el pago.
              </p>
            </div>

            {/* Resumen de precio */}
            <div className="rounded-xl bg-muted/60 px-4 py-3 flex items-end justify-between">
              <span className="text-sm text-muted-foreground">
                {done.estimatedHours} hora{done.estimatedHours !== 1 ? 's' : ''} · {hourlyRate} €/hora
              </span>
              <span className="text-2xl font-bold">{price} €</span>
            </div>

            {/* Opciones de pago */}
            <div className="space-y-2">
              <button
                onClick={() => handlePayment('stripe')}
                disabled={!!payLoading}
                className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 disabled:opacity-60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#635bff]">
                  <img src="/stripe-mark.svg" alt="Stripe" className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tarjeta bancaria</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                </div>
                {payLoading === 'stripe' && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </button>

              <button
                onClick={() => handlePayment('paypal')}
                disabled={!!payLoading}
                className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 disabled:opacity-60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003087]">
                  <img src="/paypal-mark.svg" alt="PayPal" className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">PayPal</p>
                  <p className="text-xs text-muted-foreground">Paga con tu cuenta PayPal</p>
                </div>
                {payLoading === 'paypal' && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="flex items-start gap-2 rounded-lg border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
              <span>Pago 100% seguro. Serás redirigido a la pasarela de pago correspondiente.</span>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                disabled={!!payLoading}
                onClick={() => router.push(`/${locale}/panel/tickets/${done!.ticketId}`)}
              >
                Pagar más tarde
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-xs"
                disabled={!!payLoading}
                onClick={() => { setForm(EMPTY); setFiles([]); setDone(null); }}
              >
                Crear otro ticket
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
                onClick={() => {
                  set('serviceMode')(value);
                  if (value === 'ON_SITE') setForm((f) => ({ ...f, serviceMode: value, estimatedHours: Math.max(2, f.estimatedHours) }));
                  else setForm((f) => ({ ...f, serviceMode: value }));
                }}
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

        {/* Horas a contratar */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Horas a contratar
          </h2>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Horas a contratar *</p>
                <p className="text-xs text-muted-foreground">
                  {form.serviceMode === 'REMOTE' ? 'Mínimo 1 hora · 19 €/hora' : 'Mínimo 2 horas · 39 €/hora'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, estimatedHours: Math.max(form.serviceMode === 'ON_SITE' ? 2 : 1, f.estimatedHours - 1) }))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-medium hover:bg-muted transition-colors"
                >−</button>
                <span className="w-8 text-center text-lg font-bold">{form.estimatedHours}</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, estimatedHours: f.estimatedHours + 1 }))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-medium hover:bg-muted transition-colors"
                >+</button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-background px-4 py-2 text-sm">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-bold">
                {(form.estimatedHours * (form.serviceMode === 'REMOTE' ? 19 : 39)).toFixed(0)} €
              </span>
            </div>
          </div>
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
