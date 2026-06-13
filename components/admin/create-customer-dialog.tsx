'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddressPicker, type AddressResult } from '@/components/ui/address-picker';

type FormState = {
  name: string;
  email: string;
  phone: string;
  segment: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const EMPTY: FormState = {
  name: '', email: '', phone: '', segment: '',
  address: '', city: '', postalCode: '', country: 'España',
};

export function CreateCustomerDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [createdEmail, setCreatedEmail] = useState('');
  const [form, setForm] = useState<FormState>(EMPTY);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAddress = (result: AddressResult) =>
    setForm((f) => ({
      ...f,
      address: result.address,
      city: result.city || f.city,
      postalCode: result.postalCode || f.postalCode,
      country: result.country || f.country,
    }));

  const handleClose = () => {
    setOpen(false);
    setDone(false);
    setForm(EMPTY);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Nombre y email son obligatorios');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        segment: form.segment || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setCreatedEmail(form.email);
      setDone(true);
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Error al crear el cliente');
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" /> Nuevo cliente
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear nuevo cliente</DialogTitle>
          </DialogHeader>

          {done ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-green-100 p-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold">Cliente creado</p>
              <p className="text-sm text-muted-foreground">
                Se ha enviado un email de invitación a <strong>{createdEmail}</strong> para
                que establezca su contraseña.
              </p>
              <Button onClick={handleClose} className="mt-2">Aceptar</Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Nombre completo *</Label>
                <Input value={form.name} onChange={setField('name')} placeholder="María García" />
              </div>
              <div className="space-y-1">
                <Label>Correo electrónico *</Label>
                <Input type="email" value={form.email} onChange={setField('email')} placeholder="maria@ejemplo.com" />
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
                <AddressPicker
                  value={form.address}
                  onChange={handleAddress}
                  placeholder="Buscar dirección en Google Maps..."
                />
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
                  {loading ? 'Creando...' : 'Crear y enviar invitación'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
