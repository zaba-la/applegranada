'use client';

import { useState } from 'react';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const SERVICE_LABEL: Record<string, string> = {
  REMOTE: 'Soporte remoto',
  ON_SITE: 'Soporte presencial',
};

interface Props {
  ticketId: string;
  ticketCode: string;
  serviceMode: string;
  estimatedHours?: number | null;
}

export function PayTicketButton({ ticketId, ticketCode, serviceMode, estimatedHours }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null);

  const hourlyRate = serviceMode === 'ON_SITE' ? 39 : 19;
  const hours = estimatedHours ?? (serviceMode === 'ON_SITE' ? 2 : 1);
  const price = hourlyRate * hours;

  async function handleStripe() {
    setLoading('stripe');
    try {
      const res = await fetch('/api/payments/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? 'Error al iniciar el pago con tarjeta');
        setLoading(null);
      }
    } catch {
      toast.error('Error de red al iniciar el pago');
      setLoading(null);
    }
  }

  async function handlePayPal() {
    setLoading('paypal');
    try {
      const res = await fetch('/api/payments/paypal/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? 'Error al iniciar el pago con PayPal');
        setLoading(null);
      }
    } catch {
      toast.error('Error de red al iniciar el pago');
      setLoading(null);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <CreditCard className="mr-2 h-4 w-4" />
        Pagar ahora
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) setOpen(v); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar pago</DialogTitle>
            <DialogDescription>
              Ticket {ticketCode} · {SERVICE_LABEL[serviceMode] ?? serviceMode}
            </DialogDescription>
          </DialogHeader>

          {/* Amount */}
          <div className="rounded-xl bg-muted/60 px-4 py-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">
                {hours} hora{hours !== 1 ? 's' : ''} · {hourlyRate} €/hora
              </span>
              <span className="text-2xl font-bold">{price} €</span>
            </div>
          </div>

          {/* Payment options */}
          <div className="space-y-2">
            <button
              onClick={handleStripe}
              disabled={!!loading}
              className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 disabled:opacity-60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#635bff]">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tarjeta bancaria</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
              {loading === 'stripe' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </button>

            <button
              onClick={handlePayPal}
              disabled={!!loading}
              className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 disabled:opacity-60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003087]">
                <span className="text-[10px] font-extrabold leading-none text-white">PP</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">PayPal</p>
                <p className="text-xs text-muted-foreground">Paga con tu cuenta PayPal</p>
              </div>
              {loading === 'paypal' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </button>
          </div>

          <div className="flex items-start gap-2 rounded-lg border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
            <span>Pago 100% seguro. Serás redirigido a la pasarela de pago correspondiente.</span>
          </div>

          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="w-full text-muted-foreground"
            disabled={!!loading}
          >
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
