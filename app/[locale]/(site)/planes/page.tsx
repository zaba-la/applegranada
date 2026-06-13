import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Wifi, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export async function generateMetadata() {
  return { title: 'Planes y precios | AppleGranada' };
}

const remoteFeatures = [
  'Conexión segura vía TeamViewer o FaceTime',
  'Sin desplazamientos ni tiempos de espera',
  'Disponible para cualquier problema de software',
  'Primera consulta sin coste',
  'Pago solo si se resuelve el problema',
  'Informe detallado de lo realizado',
];

const onsiteFeatures = [
  'Técnico en tu domicilio u oficina',
  'Granada capital y área metropolitana',
  'Mínimo 2 horas por visita',
  'Ideal para configuraciones o formación',
  'Atención completamente personalizada',
  'Informe detallado de lo realizado',
];

export default async function PlansPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  const contactHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/contacto`;

  return (
    <div className="container mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">Planes y precios</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Soporte técnico Apple facturado por hora. Sin suscripciones ni letra pequeña.
          Pagas exactamente por el tiempo que usas.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-start">

        {/* Remoto */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <Wifi className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl">Hora Remoto</CardTitle>
            <CardDescription className="text-base">
              Resolvemos tu problema desde cualquier lugar, en minutos.
            </CardDescription>
            <div className="pt-5 pb-1">
              <div className="text-sm text-muted-foreground">Precio por hora · Sin mínimo de horas</div>
              <div className="text-xs text-muted-foreground mt-0.5">Sin coste de desplazamiento</div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 flex-1">
            <ul className="space-y-2.5">
              {remoteFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" asChild>
              <Link href={contactHref}>
                Solicitar soporte remoto <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Presencial */}
        <div className="relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-foreground text-background px-3 py-0.5">Más completo</Badge>
          </div>
          <Card className="flex flex-col border-2 border-foreground">
            <CardHeader className="pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">Hora Presencial</CardTitle>
              <CardDescription className="text-base">
                Un técnico Apple en tu casa u oficina. Atención totalmente personal.
              </CardDescription>
              <div className="pt-5 pb-1">
                <div className="text-sm text-muted-foreground">Precio por hora · Mínimo 2 horas</div>
                <div className="text-xs text-muted-foreground mt-0.5">Desplazamiento incluido en Granada y área metro</div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 flex-1">
              <ul className="space-y-2.5">
                {onsiteFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" asChild>
                <Link href={contactHref}>
                  Solicitar soporte presencial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ¿Cuál elegir? */}
      <div className="mt-20 max-w-3xl mx-auto">
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
    </div>
  );
}
