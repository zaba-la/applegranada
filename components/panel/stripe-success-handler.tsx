'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { ticketId: string; sessionId: string }

export function StripeSuccessHandler({ ticketId, sessionId }: Props) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function confirm() {
      const res = await fetch('/api/payments/ticket/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, sessionId, method: 'STRIPE' }),
      });
      if (res.ok) {
        setDone(true);
        toast.success('¡Pago confirmado! Tu sesión de soporte está activada.');
        // Remove query params from URL without reload
        router.replace(window.location.pathname);
      }
    }
    confirm();
  }, [ticketId, sessionId, router]);

  if (!done) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
      <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
      <span><strong>Pago recibido.</strong> Nuestro equipo se pondrá en contacto contigo en menos de 24 horas para coordinar la sesión.</span>
    </div>
  );
}
