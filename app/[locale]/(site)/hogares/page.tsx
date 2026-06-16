import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Home, Star, Wifi, Camera,
  Users, Shield, RefreshCw, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata() {
  return {
    title: 'Soporte técnico Apple y Windows para familias y hogares en Granada',
    description:
      'Un experto Apple y Windows para toda tu familia. Configuramos dispositivos, recuperamos fotos, gestionamos iCloud y OneDrive, y solucionamos cualquier problema de Mac, PC, iPad o iPhone en Granada.',
    openGraph: {
      title: 'Soporte Apple y Windows para Familias y Hogares en Granada',
      description: 'Mac, PC, iPad e iPhone para toda la familia, siempre funcionando. Soporte remoto y presencial en Granada.',
    },
  };
}

const problems = [
  { icon: Camera, text: 'Fotos familiares que no sincronizan o que creías perdidas para siempre' },
  { icon: Home, text: 'El equipo compartido de los niños va lento o tiene problemas al arrancar' },
  { icon: Users, text: 'Nadie en casa sabe configurar el nuevo Mac, PC, iPhone o iPad' },
  { icon: HelpCircle, text: 'Contraseñas olvidadas, Apple ID o cuenta Microsoft bloqueada, iCloud u OneDrive llenos' },
];

const activities = [
  {
    icon: Camera,
    title: 'Recuperación de fotos y recuerdos',
    desc: 'Recuperamos fotos, vídeos y documentos que creías perdidos. Configuramos iCloud Photo Library y copias de seguridad automáticas para que no vuelva a ocurrir.',
  },
  {
    icon: RefreshCw,
    title: 'Puesta a punto del equipo familiar',
    desc: 'Actualizamos macOS o Windows de forma segura, liberamos espacio, eliminamos apps obsoletas y dejamos el equipo compartido funcionando rápido y sin problemas.',
  },
  {
    icon: Shield,
    title: 'Control parental y seguridad familiar',
    desc: 'Configuramos el Tiempo de Pantalla de Apple o Microsoft Family Safety con límites por edad, restricciones de contenido y supervisión. Ideal para que los pequeños usen los dispositivos de forma segura.',
  },
  {
    icon: Wifi,
    title: 'Configuración de nuevos dispositivos',
    desc: 'Ponemos en marcha el Mac, PC, iPad o iPhone nuevo: transferencia de datos del equipo antiguo, configuración de iCloud u OneDrive, correo, apps habituales y ajustes familiares.',
  },
];

const testimonials = [
  {
    name: 'Roberto Sánchez',
    role: 'Padre de familia, Granada capital',
    initials: 'RS',
    quote: 'El portátil con Windows que usan mis hijos para hacer los deberes se quedó sin arrancar. Lo arreglaron sin que yo tuviera que entender nada de tecnología. Explicaciones claras y precio honesto.',
  },
  {
    name: 'Pilar Torres',
    role: 'Madre de dos hijos, Armilla',
    initials: 'PT',
    quote: 'Recuperaron todas las fotos familiares de los últimos seis años que creíamos perdidas para siempre. No sé cómo lo hicieron, pero imposible ponerle precio a eso.',
  },
  {
    name: 'Francisco Ruiz',
    role: 'Jubilado, Albolote',
    initials: 'FR',
    quote: 'Mis hijos me pusieron el soporte para que tuviera el Mac siempre a punto. Ahora tengo videollamadas con los nietos sin cortes y las fotos bien organizadas. Feliz.',
  },
  {
    name: 'Mercedes Aguilar',
    role: 'Madre de tres hijos, Granada capital',
    initials: 'MA',
    quote: 'El portátil con Windows del salón se llenó de ventanas raras y publicidad. Lo limpiaron en remoto el mismo día y nos explicaron cómo evitar que vuelva a pasar.',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
      ))}
    </div>
  );
}

export default async function HogaresPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const ticketHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <FadeIn>
            <Badge variant="secondary" className="mb-5">Para hogares y familias</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
              El experto Apple y Windows de tu familia, sin tecnicismos.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Recuperamos fotos, ponemos a punto el equipo familiar, configuramos iPads, iPhones, PC y portátiles Windows,
              y solucionamos cualquier problema. En remoto o en tu casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href={ticketHref}>
                  Solicitar soporte <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/precios`}>Ver precios</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problemas */}
      <section className="container mx-auto px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-2">Situaciones que reconocerás</h2>
          <p className="text-muted-foreground mb-10">Los problemas del día a día con los dispositivos Apple en casa.</p>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {problems.map(({ icon: Icon, text }, i) => (
            <FadeIn key={text} delay={i * 70}>
              <div className="flex items-start gap-3 p-4 rounded-xl border bg-background">
                <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Actividades */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-2">Cómo ayudamos a tu familia</h2>
            <p className="text-muted-foreground mb-10">Servicios pensados para el uso cotidiano de los dispositivos Apple en el hogar.</p>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {activities.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <Card className="h-full border-0 bg-background shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué Soporte Granada */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-8">Por qué confían en nosotros las familias de Granada</h2>
        </FadeIn>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Soporte presencial a domicilio en Granada y área metropolitana',
            'Explicamos todo en lenguaje sencillo, sin tecnicismos',
            'Atendemos a toda la familia: Mac, PC, iPad, iPhone y Apple TV',
            'Servicio de recuperación de fotos y datos perdidos',
            'Configuramos iCloud, OneDrive y sincronización entre dispositivos',
            'Pago por horas: sin cuotas mensuales ni contratos',
          ].map((item, i) => (
            <FadeIn key={item} delay={i * 50}>
              <div className="flex items-start gap-2.5 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm">{item}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimoniales */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-10 text-center">Familias de Granada que ya confían en nosotros</h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 90}>
                <Card className="flex flex-col h-full">
                  <CardContent className="pt-6 flex flex-col gap-4 flex-1">
                    <Stars />
                    <p className="text-sm leading-relaxed flex-1 text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs font-semibold bg-muted">{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{t.name}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Precios */}
      <section className="bg-primary text-primary-foreground py-16">
        <FadeIn>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-3">Precios claros, sin sorpresas.</h2>
            <p className="opacity-80 mb-8 max-w-md mx-auto">
              Remoto desde <strong>19€/hora</strong> o presencial en tu casa desde <strong>39€/hora</strong> (mín. 2 horas).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/precios`}>
                  Ver precios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href={`/${locale}/contacto`}>Pregúntanos sin compromiso</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
