'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

const STORAGE_KEY = 'ag_cookie_consent';

type Consent = 'all' | 'essential' | null;

export function CookieConsent() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'es';
  const [consent, setConsent] = useState<Consent | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent | null;
    setConsent(stored);
  }, []);

  const accept = (level: 'all' | 'essential') => {
    localStorage.setItem(STORAGE_KEY, level);
    // Persistent cookie for server-side reads if ever needed
    const maxAge = 60 * 60 * 24 * 365; // 1 año
    document.cookie = `ag_cookie_consent=${level};max-age=${maxAge};path=/;SameSite=Lax`;
    setConsent(level);
  };

  // Not yet determined (first render or still loading)
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="font-semibold text-sm">Este sitio usa cookies</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Usamos cookies esenciales para el funcionamiento de la plataforma (autenticación y sesión).
          No utilizamos cookies de seguimiento ni publicidad.{' '}
          <Link
            href={`/${locale}/privacidad`}
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Política de privacidad
          </Link>
          .
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => accept('all')}
          >
            Aceptar todo
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => accept('essential')}
          >
            Solo esenciales
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Cumplimiento RGPD · Directiva ePrivacy
        </p>
      </div>
    </div>
  );
}
