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

const SERVICE_LABEL: Record<string, string> = { REMOTE: 'Soporte remoto', ON_SITE: 'Soporte presencial' };
const PRICE: Record<string, number> = { REMOTE: 19, ON_SITE: 78 };
const PRICE_DESC: Record<string, string> = {
  REMOTE: '19 €/hora · mínimo 1 hora',
  ON_SITE: '39 €/hora · mínimo 2 horas (78 €)',
};

interface Props {
  ticketId: string;
  ticketCode: string;
  serviceMode: string;
}

export function PayTicketButton({ ticketId, ticketCode, serviceMode }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = PRICE[serviceMode] ?? 19;

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      setLoading(false);
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? 'Error al iniciar el pago');
    }
  };

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

          {/* Amount summary */}
          <div className="rounded-xl bg-muted/60 px-4 py-4 text-sm">
            <div className="flex items-end justify-between">
              <span className="text-muted-foreground">{PRICE_DESC[serviceMode]}</span>
              <span className="text-2xl font-bold">{price} €</span>
            </div>
          </div>

          {/* Payment method info */}
          <div className="flex items-start gap-2.5 rounded-lg border bg-muted/20 px-3 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
            <span>
              Serás redirigido a la pasarela segura de Stripe. Puedes pagar con{' '}
              <strong className="text-foreground">tarjeta</strong> o{' '}
              <strong className="text-foreground">Bizum</strong> directamente desde tu app bancaria.
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handlePay} className="flex-1" disabled={loading}>
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Redirigiendo…</>
                : 'Ir a pagar →'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
