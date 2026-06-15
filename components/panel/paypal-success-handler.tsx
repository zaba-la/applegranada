'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  ticketId: string;
  orderId: string;
}

export function PayPalSuccessHandler({ ticketId, orderId }: Props) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function capture() {
      const res = await fetch('/api/payments/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ticketId }),
      });
      if (res.ok) {
        setDone(true);
        toast.success('¡Pago con PayPal confirmado! Tu sesión de soporte está activada.');
        router.replace(window.location.pathname);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Error al confirmar el pago');
      }
    }
    capture();
  }, [orderId, ticketId, router]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <strong>Error al confirmar el pago:</strong> {error}
      </div>
    );
  }

  if (!done) {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Confirmando pago con PayPal…
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
      <span>
        <strong>Pago recibido.</strong> Nuestro equipo se pondrá en contacto contigo en menos de 24 horas para coordinar la sesión.
      </span>
    </div>
  );
}
