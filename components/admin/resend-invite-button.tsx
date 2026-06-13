'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, Link2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

export function ResendInviteButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/resend-invite`, { method: 'POST' });
      if (res.ok) {
        toast.success('Invitación enviada por email');
      } else {
        const data = await res.json();
        toast.error(data.error ?? 'Error al enviar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/generate-link`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLink(data.link);
      } else {
        toast.error('Error al generar el enlace');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (link) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 max-w-sm">
        <p className="text-xs text-muted-foreground truncate flex-1">{link}</p>
        <button
          onClick={copyLink}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          title="Copiar enlace"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <><Send className="mr-2 h-4 w-4" />Dar acceso</>
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={sendEmail}>
          <Send className="mr-2 h-4 w-4" />
          Enviar por email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Copiar enlace (WhatsApp, etc.)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
