'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function ResendInviteButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/resend-invite`, {
        method: 'POST',
      });
      if (res.ok) {
        setSent(true);
        toast.success('Invitación enviada correctamente');
      } else {
        const data = await res.json();
        toast.error(data.error ?? 'Error al enviar la invitación');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
        <CheckCircle className="h-4 w-4" />
        Invitación enviada
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleResend} disabled={loading}>
      {loading
        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando…</>
        : <><Send className="mr-2 h-4 w-4" />Reenviar invitación</>
      }
    </Button>
  );
}
