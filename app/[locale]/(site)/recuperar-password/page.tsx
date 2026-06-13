'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RecuperarPasswordPage() {
  const { locale } = useParams<{ locale: string }>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to avoid email enumeration
      setSent(true);
    } catch {
      toast.error('Error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {sent ? (
          <Card className="text-center">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-2">Revisa tu correo</p>
                <p className="text-sm text-muted-foreground">
                  Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para
                  restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                ¿No lo ves? Revisa la carpeta de spam.
              </p>
              <Link href={`/${locale}/login`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
              <CardDescription>
                Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                <Link href={`/${locale}/login`} className="hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Volver al inicio de sesión
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
