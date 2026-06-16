import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, Wifi, Briefcase,
  Database, Clock, Shield, BarChart, RefreshCw, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata() {
  return {
    title: 'Soporte técnico Apple y Windows para autónomos y profesionales en Granada',
    description:
      'Mantén tu Mac, PC, iPad e iPhone siempre a punto. Soporte especializado para autónomos, diseñadores, fotógrafos, arquitectos y profesionales que dependen de Apple o Windows para trabajar.',
    openGraph: {
      title: 'Soporte Apple y Windows para Profesionales y Autónomos en Granada',
      description: 'Tu equipo es tu herramienta. Soporte técnico Apple y Windows preventivo y correctivo para profesionales que no pueden permitirse tiempos de inactividad.',
    },
  };
}

const problems = [
  { icon: Zap, text: 'El Mac o el PC falla en medio de un proyecto urgente para un cliente' },
  { icon: Database, text: 'Lightroom, Revit, Final Cut o DaVinci van lentos o se cierran solos' },
  { icon: Clock, text: 'Horas perdidas en actualizaciones que salieron mal o en buscar soluciones' },
  { icon: Shield, text: 'Sin copia de seguridad fiable de los proyectos y el trabajo de meses' },
];

const activities = [
  {
    icon: RefreshCw,
    title: 'Mantenimiento preventivo',
    desc: 'Actualizaciones seguras de macOS o Windows, limpieza de disco, optimización del sistema y revisión de seguridad. Acordamos la sesión fuera de tu horario de trabajo para no interrumpir.',
  },
  {
    icon: Database,
    title: 'Optimización del software profesional',
    desc: 'Configuramos y optimizamos las apps que usas a diario: Adobe CC, Final Cut Pro, DaVinci Resolve, Revit, AutoCAD, Microsoft 365, Logic Pro. Rendimiento al máximo.',
  },
  {
    icon: Shield,
    title: 'Backup estratégico para proyectos',
    desc: 'Diseñamos y configuramos un sistema de copias de seguridad a medida: Time Machine, OneDrive, almacenamiento en la nube y copias locales. Tus proyectos, siempre protegidos.',
  },
  {
    icon: Wifi,
    title: 'Resolución urgente en remoto',
    desc: 'Cuando algo falla en plena jornada, nos conectamos vía TeamViewer y lo resolvemos sin que tengas que desplazarte. Respuesta prioritaria para clientes recurrentes.',
  },
];

const testimonials = [
  {
    name: 'Javier Castillo',
    role: 'Arquitecto autónomo, Granada',
    initials: 'JC',
    quote: 'Mi MacBook Pro es mi herramienta de trabajo. Cuando empezó a fallar con Revit, lo resolvieron en remoto en menos de una hora, un martes por la tarde. Sin perder ni un archivo.',
  },
  {
    name: 'Ana Jiménez',
    role: 'Fotógrafa profesional',
    initials: 'AJ',
    quote: 'Me organizaron el almacenamiento y las copias de seguridad de Lightroom. Por fin sé que mis archivos están seguros y el flujo de trabajo va fluido. Debí haberlo hecho antes.',
  },
  {
    name: 'David Fernández',
    role: 'Diseñador gráfico freelance',
    initials: 'DF',
    quote: 'Llevo tiempo con su soporte y no he tenido ningún problema serio. Cuando algo falla, lo resuelven ese mismo día. No me imagino trabajando sin este respaldo.',
  },
  {
    name: 'Marta Delgado',
    role: 'Gestora administrativa autónoma',
    initials: 'MD',
    quote: 'Mi portátil con Windows se quedó pillado actualizando justo antes de presentar unos impuestos. Lo resolvieron por TeamViewer esa misma tarde, sin perder ni un archivo.',
  },
];

const tools = [
  'Adobe Creative Cloud', 'Final Cut Pro',
  'Revit / AutoCAD', 'Microsoft 365', 'Google Workspace', 'Lightroom Classic',
  'Sketch / Figma',
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

export default async function ProfesionalesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const ticketHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <FadeIn>
            <Badge variant="secondary" className="mb-5">Para profesionales y autónomos</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
              Tu herramienta de trabajo, siempre a punto.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Soporte técnico Apple y Windows especializado para autónomos, diseñadores, fotógrafos,
              arquitectos y cualquier profesional que dependa de su Mac o su PC para trabajar.
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
          <h2 className="text-2xl font-semibold mb-2">Los problemas que te cuestan dinero</h2>
          <p className="text-muted-foreground mb-10">Cuando el equipo falla, dejas de trabajar. Resolvemos estos problemas antes o cuando ocurren.</p>
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
            <h2 className="text-2xl font-semibold mb-2">Cómo mantenemos tu negocio funcionando</h2>
            <p className="text-muted-foreground mb-10">Servicios de soporte técnico Apple y Windows orientados al rendimiento y la continuidad laboral.</p>
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

      {/* Software que conocemos */}
      <section className="container mx-auto px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-3">Software profesional que conocemos a fondo</h2>
          <p className="text-muted-foreground mb-8">No somos técnicos genéricos. Conocemos las apps que usas para trabajar.</p>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {tools.map((tool) => (
              <Badge key={tool} variant="secondary" className="text-sm py-1 px-3">{tool}</Badge>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Por qué Soporte Granada */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-8">Lo que valoramos los profesionales</h2>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Respuesta el mismo día para urgencias durante la jornada laboral',
              'Mantenimiento programado fuera de tu horario de trabajo',
              'Conocemos las apps profesionales: Adobe, Final Cut, Office, Revit…',
              'Informe detallado de cada sesión para tu contabilidad',
              'Sin contratos ni cuotas: pagas solo lo que usas',
              'Soporte remoto o presencial según lo que mejor encaje',
            ].map((item, i) => (
              <FadeIn key={item} delay={i * 50}>
                <div className="flex items-start gap-2.5 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoniales */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-10 text-center">Profesionales que ya confían en nosotros</h2>
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
            <h2 className="text-3xl font-bold mb-3">Un coste predecible para tu negocio.</h2>
            <p className="opacity-80 mb-8 max-w-md mx-auto">
              Remoto <strong>19€/hora</strong> · Presencial <strong>39€/hora</strong> (mín. 2h).
              Sin cuotas fijas. Sin sorpresas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/precios`}>
                  Ver precios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href={`/${locale}/contacto`}>Cuéntanos tu caso</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
