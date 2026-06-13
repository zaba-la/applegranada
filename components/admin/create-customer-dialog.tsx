'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
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
  password: string;
  phone: string;
  segment: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const EMPTY: FormState = {
  name: '', email: '', password: '', phone: '', segment: '',
  address: '', city: '', postalCode: '', country: 'España',
};

export function CreateCustomerDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (res.ok) {
      toast.success('Cliente creado correctamente');
      setOpen(false);
      setForm(EMPTY);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear nuevo cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 py-2">

            {/* Datos de acceso */}
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

            {/* Dirección */}
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
