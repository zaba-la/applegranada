'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, Mail, Phone, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileDropzone, type AttachedFile } from '@/components/ui/file-dropzone';
import { AddressPicker, type AddressResult } from '@/components/ui/address-picker';
import { PhoneInput } from '@/components/ui/phone-input';

type Customer = { id: string; name: string; email: string; phone?: string | null };

type Props = {
  customers: Customer[];
  locale: string;
};

type FormState = {
  customerId: string;
  title: string;
  description: string;
  serviceMode: 'REMOTE' | 'ON_SITE';
  deviceType: string;
  priority: string;
  estimatedHours: number;
  address: string;
  city: string;
  postalCode: string;
};

const EMPTY: FormState = {
  customerId: '',
  title: '',
  description: '',
  serviceMode: 'REMOTE',
  deviceType: 'MAC',
  priority: 'MEDIUM',
  estimatedHours: 1,
  address: '',
  city: 'Granada',
  postalCode: '',
};

type NewCustomerForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  segment: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const EMPTY_CUSTOMER: NewCustomerForm = {
  name: '', email: '', password: '', phone: '', segment: '',
  address: '', city: '', postalCode: '', country: 'España',
};

type SuccessData = {
  ticketCode: string;
  ticketNumber: string;
  customerEmail: string;
};

async function uploadFiles(files: AttachedFile[]) {
  if (!files.length) return [];
  const fd = new FormData();
  files.forEach(({ file }) => fd.append('files', file));
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Error al subir archivos');
  const data = await res.json();
  return data.files as { name: string; url: string; size: number; type: string }[];
}

// ─── Inline create-customer modal ────────────────────────────────────────────
function CreateCustomerModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (customer: Customer) => void;
}) {
  const [form, setForm] = useState<NewCustomerForm>(EMPTY_CUSTOMER);
  const [loading, setLoading] = useState(false);

  const setField = (k: keyof NewCustomerForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAddress = (result: AddressResult) =>
    setForm((f) => ({
      ...f,
      address: result.address,
      city: result.city || f.city,
      postalCode: result.postalCode || f.postalCode,
      country: result.country || f.country,
    }));

  const handleClose = () => {
    setForm(EMPTY_CUSTOMER);
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Nombre, email y contraseña son obligatorios');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.password,
        phone: form.phone || undefined,
        segment: form.segment || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country || undefined,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? 'Error al crear el cliente');
      return;
    }

    const data = await res.json();
    toast.success('Cliente creado');
    onCreated({ id: data.id, name: data.name, email: data.email });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Nombre completo *</Label>
            <Input value={form.name} onChange={setField('name')} placeholder="María García" />
          </div>
          <div className="space-y-1">
            <Label>Correo electrónico *</Label>
            <Input type="email" value={form.email} onChange={setField('email')} placeholder="maria@ejemplo.com" />
          </div>
          <div className="space-y-1">
            <Label>Contraseña temporal *</Label>
            <Input type="password" value={form.password} onChange={setField('password')} placeholder="Mínimo 8 caracteres" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Teléfono</Label>
              <PhoneInput
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Segmento</Label>
              <Select value={form.segment} onValueChange={(v) => setForm((f) => ({ ...f, segment: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Estudiante</SelectItem>
                  <SelectItem value="HOME">Hogar</SelectItem>
                  <SelectItem value="PROFESSIONAL">Profesional</SelectItem>
                  <SelectItem value="BUSINESS">Empresa</SelectItem>
                  <SelectItem value="NONE">No disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Dirección</Label>
            <AddressPicker value={form.address} onChange={handleAddress} />
          </div>
          {(form.city || form.postalCode) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Ciudad</Label>
                <Input value={form.city} onChange={setField('city')} />
              </div>
              <div className="space-y-1">
                <Label>Código postal</Label>
                <Input value={form.postalCode} onChange={setField('postalCode')} maxLength={5} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function CreateTicketForm({ customers: initial, locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [customers, setCustomers] = useState<Customer[]>(initial);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const set = (key: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [key]: v }));
  const selectedCustomer = customers.find((c) => c.id === form.customerId);

  const handleTicketAddress = (result: AddressResult) =>
    setForm((f) => ({
      ...f,
      address: result.address,
      city: result.city || f.city,
      postalCode: result.postalCode || f.postalCode,
    }));

  const handleCustomerChange = (value: string) => {
    if (value === '__create__') {
      setShowNewCustomer(true);
      return;
    }
    set('customerId')(value);
  };

  const handleCustomerCreated = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setForm((f) => ({ ...f, customerId: newCustomer.id }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId) { toast.error('Selecciona un cliente'); return; }
    if (!form.title.trim()) { toast.error('El título es obligatorio'); return; }
    if (!form.description || form.description === '<p></p>') {
      toast.error('La descripción es obligatoria');
      return;
    }
    if (form.serviceMode === 'ON_SITE' && !form.address.trim()) {
      toast.error('La dirección es obligatoria para soporte presencial');
      return;
    }

    setLoading(true);
    try {
      const attachments = await uploadFiles(files);
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachments }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al crear el ticket');
      }
      const data = await res.json();
      setSuccess({
        ticketCode: data.ticketCode,
        ticketNumber: data.ticketNumber,
        customerEmail: data.customerEmail,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <div>
            <p className="text-lg font-semibold">Ticket creado correctamente</p>
            <p className="mt-1 text-3xl font-bold tracking-widest text-primary">
              {success.ticketCode}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{success.ticketNumber}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Correo enviado a <strong>{success.customerEmail}</strong>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setForm(EMPTY); setFiles([]); setSuccess(null); }}
            >
              Crear otro ticket
            </Button>
            <Button onClick={() => router.push(`/${locale}/admin/tickets`)}>
              Ver todos los tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Form ───────────────────────────────────────────────────────────────────
  return (
    <>
      <CreateCustomerModal
        open={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        onCreated={handleCustomerCreated}
      />

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Cliente */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cliente
          </h2>
          <div className="space-y-1">
            <Label>Seleccionar cliente *</Label>
            <Select value={form.customerId} onValueChange={handleCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Buscar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.email}</span>
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="__create__">
                  <span className="flex items-center gap-2 text-primary">
                    <UserPlus className="h-3.5 w-3.5" />
                    Crear nuevo cliente
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {selectedCustomer && (
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {selectedCustomer.email}
                </span>
                {selectedCustomer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {selectedCustomer.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Detalles */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Detalles del ticket
          </h2>
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input
              value={form.title}
              onChange={(e) => set('title')(e.target.value)}
              placeholder="Ej. Mac no arranca después de actualizar macOS"
            />
          </div>
          <div className="space-y-1">
            <Label>Descripción *</Label>
            <RichTextEditor
              value={form.description}
              onChange={set('description')}
              placeholder="Describe el problema con detalle: síntomas, cuándo empezó, qué ha intentado el cliente..."
            />
          </div>
        </section>

        {/* Modalidad */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Modalidad y clasificación
          </h2>
          <div className="space-y-1">
            <Label>Modalidad *</Label>
            <div className="flex gap-2">
              {([
                { value: 'REMOTE', label: 'Remoto', sub: '19€/hora · TeamViewer' },
                { value: 'ON_SITE', label: 'Presencial', sub: '39€/hora · mín. 2h' },
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
          </div>

          {form.serviceMode === 'ON_SITE' && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">Dirección del servicio</p>
              <div className="space-y-1">
                <Label>Dirección *</Label>
                <AddressPicker value={form.address} onChange={handleTicketAddress} />
              </div>
              {(form.city || form.postalCode) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Ciudad</Label>
                    <Input value={form.city} onChange={(e) => set('city')(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Código postal</Label>
                    <Input
                      value={form.postalCode}
                      onChange={(e) => set('postalCode')(e.target.value)}
                      placeholder="18001"
                      maxLength={5}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
                  <SelectItem value="MULTIPLE">Múltiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Prioridad *</Label>
              <Select value={form.priority} onValueChange={set('priority')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Horas a contratar */}
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
                  onClick={() => setForm((f) => ({ ...f, estimatedHours: Math.max(f.serviceMode === 'ON_SITE' ? 2 : 1, f.estimatedHours - 1) }))}
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

        {/* Adjuntos */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Archivos adjuntos
          </h2>
          <FileDropzone files={files} onChange={setFiles} />
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-6">
          <p className="text-xs text-muted-foreground">
            El número de ticket se generará automáticamente al guardar.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/admin/tickets`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creando ticket...' : 'Crear ticket y notificar'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
