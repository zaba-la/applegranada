'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, Link2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const getLink = async (sendEmail: boolean) => {
    setLoading(true);
    try {
      const endpoint = sendEmail
        ? `/api/admin/customers/${customerId}/resend-invite`
        : `/api/admin/customers/${customerId}/generate-link`;

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();

      if (sendEmail && res.ok) {
        toast.success('Invitación enviada por email');
        return;
      }

      const generatedLink = data.link;
      if (generatedLink) {
        setLink(generatedLink);
        if (sendEmail) toast.error('Email no enviado — comparte el enlace manualmente');
      } else {
        toast.error(data.error ?? 'Error al generar el enlace');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!link || !inputRef.current) return;
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // If execCommand fails, the text is still selected so user can Cmd+C
    }
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => getLink(true)}>
            <Send className="mr-2 h-4 w-4" />
            Enviar por email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => getLink(false)}>
            <Link2 className="mr-2 h-4 w-4" />
            Generar enlace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!link} onOpenChange={(open) => { if (!open) setLink(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enlace de acceso</DialogTitle>
            <DialogDescription>
              Copia este enlace y envíaselo al cliente por WhatsApp, SMS o email. Válido 7 días.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                readOnly
                value={link ?? ''}
                onClick={() => inputRef.current?.select()}
                className="flex-1 rounded-md border bg-muted/40 px-3 py-2 text-sm font-mono text-muted-foreground cursor-text select-all"
              />
              <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                {copied
                  ? <><Check className="mr-2 h-4 w-4 text-green-600" />Copiado</>
                  : <><Copy className="mr-2 h-4 w-4" />Copiar</>
                }
              </Button>
            </div>

            <div className="flex gap-2">
              {link && (
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Hola, aquí tienes tu enlace para acceder a Soporte Granada: ' + link)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Enviar por WhatsApp
                  </a>
                </Button>
              )}
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => setLink(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
