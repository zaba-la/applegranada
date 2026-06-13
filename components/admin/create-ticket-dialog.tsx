'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

type Customer = { id: string; name: string; email: string };

type FormState = {
  customerId: string;
  title: string;
  description: string;
  serviceMode: string;
  deviceType: string;
  priority: string;
};

const EMPTY: FormState = {
  customerId: '',
  title: '',
  description: '',
  serviceMode: 'REMOTE',
  deviceType: 'MAC',
  priority: 'MEDIUM',
};

export function CreateTicketDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (open && customers.length === 0) {
      fetch('/api/customers')
        .then((r) => r.json())
        .then((data) =>
          setCustomers(
            (data as Array<{ id: string; user: { name: string; email: string } }>).map((c) => ({
              id: c.id,
              name: c.user.name,
              email: c.user.email,
            }))
          )
        )
        .catch(() => toast.error('No se pudieron cargar los clientes'));
    }
  }, [open, customers.length]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSel = (key: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId || !form.title || !form.description) {
      toast.error('Cliente, título y descripción son obligatorios');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/admin/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Ticket creado correctamente');
      setOpen(false);
      setForm(EMPTY);
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Error al crear el ticket');
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Nuevo ticket
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear ticket de soporte</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Cliente *</Label>
              <Select value={form.customerId} onValueChange={setSel('customerId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Título *</Label>
              <Input value={form.title} onChange={set('title')} placeholder="Descripción breve del problema" />
            </div>

            <div className="space-y-1">
              <Label>Descripción *</Label>
              <Textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Detalla el problema del cliente..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Modalidad</Label>
                <Select value={form.serviceMode} onValueChange={setSel('serviceMode')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remoto</SelectItem>
                    <SelectItem value="ON_SITE">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Dispositivo</Label>
                <Select value={form.deviceType} onValueChange={setSel('deviceType')}>
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
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={setSel('priority')}>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
