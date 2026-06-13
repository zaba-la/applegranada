import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Wifi, MapPin, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FadeIn } from '@/components/fade-in';
import Link from 'next/link';

export async function generateMetadata() {
  return { title: 'Precios | AppleGranada' };
}

const remoteFeatures = [
  'Conexión segura vía TeamViewer',
  'Sin desplazamientos ni esperas',
  'Disponible en toda España',
  'Informe detallado de lo realizado',
];

const onsiteFeatures = [
  'Técnico en tu domicilio u oficina',
  'Granada capital y área metropolitana',
  'Mínimo 2 horas por visita',
  'Ideal para configuraciones complejas',
  'Atención completamente personalizada',
  'Informe detallado de lo realizado',
];

export default async function PlansPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  const ticketHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`;

  return (
    <div className="container mx-auto px-4 py-16">

      {/* Header */}
      <FadeIn>
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">Precios</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Soporte técnico Apple facturado por hora. Sin suscripciones ni letra pequeña.
            Pagas exactamente por el tiempo que usas.
          </p>
        </div>
      </FadeIn>

      {/* Plan cards */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch">

        {/* Remoto */}
        <FadeIn delay={100} className="h-full">
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                <Wifi className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">Hora Remoto</CardTitle>
              <CardDescription className="text-base">
                Resolvemos tu problema desde cualquier lugar, vía TeamViewer.
              </CardDescription>
              <div className="pt-5">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold">19€</span>
                  <span className="text-muted-foreground mb-1">/hora</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Sin mínimo de horas · Sin desplazamiento</div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 pt-0">
              <ul className="space-y-2.5">
                {remoteFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 space-y-3">
                <Button className="w-full" asChild>
                  <Link href={ticketHref}>
                    Solicitar soporte remoto <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!session && (
                  <p className="text-xs text-center text-muted-foreground">
                    Necesitas una cuenta para solicitar soporte.{' '}
                    <Link href={`/${locale}/register`} className="underline underline-offset-2">Regístrate aquí.</Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Presencial */}
        <FadeIn delay={180} className="h-full">
          <div className="relative h-full">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-foreground text-background px-3 py-0.5">Más completo</Badge>
            </div>
            <Card className="flex flex-col h-full border-2 border-foreground">
              <CardHeader className="pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Hora Presencial</CardTitle>
                <CardDescription className="text-base">
                  Un técnico Apple en tu casa u oficina. Mínimo 2 horas.
                </CardDescription>
                <div className="pt-5">
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-bold">39€</span>
                    <span className="text-muted-foreground mb-1">/hora</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Mínimo 2 horas (78€) · Desplazamiento incluido</div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 pt-0">
                <ul className="space-y-2.5">
                  {onsiteFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 space-y-3">
                  <Button className="w-full" asChild>
                    <Link href={ticketHref}>
                      Solicitar soporte presencial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {!session && (
                    <p className="text-xs text-center text-muted-foreground">
                      Necesitas una cuenta para solicitar soporte.{' '}
                      <Link href={`/${locale}/register`} className="underline underline-offset-2">Regístrate aquí.</Link>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>

      {/* Aviso de pago */}
      <FadeIn delay={240}>
        <div className="flex items-start gap-3 bg-muted/60 border rounded-xl px-5 py-4 max-w-4xl mx-auto mt-8">
          <CreditCard className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Pago previo requerido.</span>{' '}
            El soporte no comienza hasta confirmar el pago. Una vez realizado, te contactamos
            en menos de 24 horas para coordinar la sesión.
          </p>
        </div>
      </FadeIn>

      {/* ¿Cuál elegir? */}
      <FadeIn delay={100}>
        <div className="mt-20 max-w-4xl mx-auto">
          <Separator className="mb-12" />
          <h2 className="text-2xl font-semibold text-center mb-8">¿Cuál modalidad necesito?</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="bg-muted/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-4 w-4" />
                <p className="font-semibold text-sm">Elige Remoto si…</p>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>· El Mac arranca y puedes conectarte a internet</li>
                <li>· Tienes un problema de software, velocidad o configuración</li>
                <li>· Estás fuera de Granada o prefieres no recibir visitas</li>
                <li>· Necesitas ayuda rápida sin esperar cita presencial</li>
              </ul>
            </div>
            <div className="bg-muted/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                <p className="font-semibold text-sm">Elige Presencial si…</p>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>· El equipo no arranca o no se puede conectar</li>
                <li>· Quieres formación o configuración inicial completa</li>
                <li>· Tienes varios equipos en una empresa u oficina</li>
                <li>· Prefieres que el técnico esté contigo en persona</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿No sabes cuál elegir?{' '}
            <Link href={`/${locale}/contacto`} className="underline underline-offset-4 hover:text-foreground transition-colors">
              Cuéntanos tu caso y te orientamos sin compromiso.
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
