'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PhoneInput } from '@/components/ui/phone-input';
import { RegisterSchema, type RegisterInput } from '@/lib/schemas';

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });
  const phoneValue = watch('phone') ?? '';

  const onSubmit = async (data: RegisterInput) => {
    if (!accepted) {
      toast.error('Debes aceptar los Términos de Uso y la Política de Privacidad');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error ?? 'Error al registrarse');
      setLoading(false);
      return;
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push(`/${locale}/panel`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Logo height={28} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear una nueva cuenta</CardTitle>
            <CardDescription>Crea tu cuenta para gestionar tus tickets de soporte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Fila 1: Nombre + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input id="name" placeholder="María García" {...register('name')} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input id="email" type="email" placeholder="maria@ejemplo.com" autoComplete="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              {/* Fila 2: Teléfono */}
              <div className="space-y-1">
                <Label htmlFor="phone">Teléfono <span className="text-muted-foreground">(opcional)</span></Label>
                <PhoneInput
                  id="phone"
                  value={phoneValue}
                  onChange={(v) => setValue('phone', v)}
                />
              </div>

              {/* Fila 3: Contraseña + Confirmar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      className="pr-10"
                      autoComplete="new-password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Repite la contraseña"
                      className="pr-10"
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-hidden
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Términos */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-foreground cursor-pointer"
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
                  He leído y acepto los{' '}
                  <Link href={`/${locale}/terminos`} target="_blank" className="underline underline-offset-2 hover:text-foreground">
                    Términos de Uso
                  </Link>{' '}
                  y la{' '}
                  <Link href={`/${locale}/privacidad`} target="_blank" className="underline underline-offset-2 hover:text-foreground">
                    Política de Privacidad
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !accepted}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link href={`/${locale}/login`} className="font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
