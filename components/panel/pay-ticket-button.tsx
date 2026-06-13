'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Copy, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SERVICE_LABEL: Record<string, string> = { REMOTE: 'Soporte remoto', ON_SITE: 'Soporte presencial' };
const PRICE: Record<string, number> = { REMOTE: 19, ON_SITE: 78 };
const PRICE_DESC: Record<string, string> = {
  REMOTE: '19 €/hora · mínimo 1 hora',
  ON_SITE: '39 €/hora · mínimo 2 horas (78 €)',
};

type Method = 'STRIPE' | 'BIZUM' | null;

interface BizumInfo { bizumPhone: string; amount: number; reference: string }

interface Props {
  ticketId: string;
  ticketCode: string;
  serviceMode: string;
  onPaid?: () => void;
}

export function PayTicketButton({ ticketId, ticketCode, serviceMode, onPaid }: Props) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<Method>(null);
  const [loading, setLoading] = useState(false);
  const [bizumInfo, setBizumInfo] = useState<BizumInfo | null>(null);
  const [notified, setNotified] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const price = PRICE[serviceMode] ?? 19;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleStripe = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, method: 'STRIPE' }),
    });
    setLoading(false);
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      const { error } = await res.json();
      toast.error(error ?? 'Error al iniciar el pago');
    }
  };

  const handleBizum = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, method: 'BIZUM' }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setBizumInfo(data);
    } else {
      const { error } = await res.json();
      toast.error(error ?? 'Error al preparar el pago Bizum');
    }
  };

  const handleBizumNotify = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/ticket/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, method: 'BIZUM' }),
    });
    setLoading(false);
    if (res.ok) {
      setNotified(true);
      toast.success('Hemos notificado al equipo. Confirmaremos tu pago en breve.');
      onPaid?.();
    } else {
      toast.error('Error al notificar. Inténtalo de nuevo.');
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setMethod(null);
    setBizumInfo(null);
    setNotified(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <CreditCard className="mr-2 h-4 w-4" />
        Pagar ahora
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar pago</DialogTitle>
            <DialogDescription>
              Ticket {ticketCode} · {SERVICE_LABEL[serviceMode] ?? serviceMode}
            </DialogDescription>
          </DialogHeader>

          {/* Amount summary */}
          <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm">
            <div className="flex items-end justify-between">
              <span className="text-muted-foreground">{PRICE_DESC[serviceMode]}</span>
              <span className="text-xl font-bold">{price} €</span>
            </div>
          </div>

          {/* Method selection */}
          {!method && !bizumInfo && (
            <div className="space-y-3 pt-1">
              <p className="text-sm text-muted-foreground">Elige cómo quieres pagar:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethod('STRIPE')}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium hover:border-foreground hover:bg-muted/40 transition-all"
                >
                  <CreditCard className="h-6 w-6" />
                  Tarjeta
                  <span className="text-xs text-muted-foreground font-normal">Visa, Mastercard, Amex</span>
                </button>
                <button
                  onClick={() => setMethod('BIZUM')}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium hover:border-foreground hover:bg-muted/40 transition-all"
                >
                  <Smartphone className="h-6 w-6" />
                  Bizum
                  <span className="text-xs text-muted-foreground font-normal">Desde tu app bancaria</span>
                </button>
              </div>
            </div>
          )}

          {/* Stripe confirmation */}
          {method === 'STRIPE' && !bizumInfo && (
            <div className="space-y-4 pt-1">
              <p className="text-sm text-muted-foreground">
                Serás redirigido a la pasarela segura de Stripe para completar el pago con tu tarjeta.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMethod(null)} className="flex-1" disabled={loading}>
                  Volver
                </Button>
                <Button onClick={handleStripe} className="flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pagar con tarjeta →'}
                </Button>
              </div>
            </div>
          )}

          {/* Bizum confirmation */}
          {method === 'BIZUM' && !bizumInfo && (
            <div className="space-y-4 pt-1">
              <p className="text-sm text-muted-foreground">
                Recibirás los datos para realizar la transferencia por Bizum desde tu app bancaria.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMethod(null)} className="flex-1" disabled={loading}>
                  Volver
                </Button>
                <Button onClick={handleBizum} className="flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ver datos Bizum →'}
                </Button>
              </div>
            </div>
          )}

          {/* Bizum details */}
          {bizumInfo && !notified && (
            <div className="space-y-4 pt-1">
              <p className="text-sm text-muted-foreground">
                Abre tu app bancaria, selecciona Bizum y envía el pago con estos datos:
              </p>

              <div className="space-y-2">
                {[
                  { label: 'Teléfono Bizum', value: bizumInfo.bizumPhone, key: 'phone' },
                  { label: 'Importe', value: `${bizumInfo.amount} €`, key: 'amount' },
                  { label: 'Concepto', value: bizumInfo.reference, key: 'ref' },
                ].map(({ label, value, key }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-mono text-sm font-semibold">{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(value, key)}
                      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Copiar ${label}`}
                    >
                      {copied === key ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Una vez enviado, pulsa el botón para notificarnos. Confirmaremos la recepción y activaremos tu sesión de soporte.
              </p>

              <Button onClick={handleBizumNotify} className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Ya he enviado el pago
              </Button>
            </div>
          )}

          {/* Bizum notified */}
          {notified && (
            <div className="py-4 text-center space-y-2">
              <Check className="mx-auto h-10 w-10 text-green-500" />
              <p className="font-medium">¡Pago notificado!</p>
              <p className="text-sm text-muted-foreground">
                Verificaremos tu Bizum y activaremos tu sesión en breve.
              </p>
              <Button onClick={handleClose} variant="outline" className="mt-2">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
