import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Laptop, BookOpen, GraduationCap,
  Star, Wifi, AlertTriangle, Clock, HardDrive, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata() {
  return {
    title: 'Soporte técnico Apple y Windows para estudiantes en Granada',
    description:
      'Soluciones rápidas para Mac, iPad, iPhone, PC y Surface cuando más los necesitas: entregas, TFG, exámenes. Soporte remoto desde 19€/h. Sin esperas, sin tecnicismos.',
    openGraph: {
      title: 'Soporte Apple y Windows para Estudiantes en Granada',
      description: '¿Tu equipo falla antes de entregar? Resolvemos problemas de macOS, Windows, apps y rendimiento para estudiantes universitarios en Granada.',
    },
  };
}

const problems = [
  { icon: AlertTriangle, text: 'El Mac o el portátil con Windows se congela o va lento justo cuando más lo necesitas' },
  { icon: HardDrive, text: 'Sin espacio en el disco y sin saber qué borrar sin perder nada' },
  { icon: ShieldAlert, text: 'Una actualización rompió algo y ya no abren las apps del estudio' },
  { icon: Clock, text: 'Entregas en horas y el equipo no responde' },
];

const activities = [
  {
    icon: Laptop,
    title: 'Optimización de rendimiento',
    desc: 'Liberamos espacio, limpiamos procesos en segundo plano y dejamos el Mac o el PC funcionando como el primer día. Ideal cuando el disco está casi lleno o el equipo va lento.',
  },
  {
    icon: BookOpen,
    title: 'Recuperación de archivos y trabajos',
    desc: 'Recuperamos documentos, presentaciones y proyectos que creías perdidos. También configuramos copias automáticas en iCloud o OneDrive para que no vuelva a pasar.',
  },
  {
    icon: GraduationCap,
    title: 'Configuración de software académico',
    desc: 'Xcode, Adobe Creative Cloud, Microsoft 365, Teams, OneDrive, Zotero, SPSS, MATLAB, Revit… Lo instalamos, activamos y configuramos correctamente en tu Mac o PC.',
  },
  {
    icon: Wifi,
    title: 'Solución urgente el mismo día',
    desc: 'Sesión remota vía TeamViewer. Si tu equipo arranca y tiene internet, podemos resolver la mayoría de problemas en menos de una hora, sin que te muevas.',
  },
];

const testimonials = [
  {
    name: 'Laura Moreno',
    role: 'Estudiante de Bellas Artes, UGR',
    initials: 'LM',
    quote: 'Se me bloqueó el Mac dos días antes de entregar el TFG. Los llamé por la mañana y esa misma tarde ya lo tenía funcionando. No sé qué hubiera hecho sin ellos.',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Estudiante de Ingeniería Informática, UGR',
    initials: 'CR',
    quote: 'Llevaba semanas con el portátil con Windows lentísimo y sin espacio para mis proyectos de la carrera. En una sesión remota de 40 minutos lo dejaron como nuevo, liberando espacio y optimizando el arranque.',
  },
  {
    name: 'Sofía Navarro',
    role: 'Estudiante de Diseño Gráfico, EASD Granada',
    initials: 'SN',
    quote: 'Me configuraron todo el software de Adobe después de actualizar macOS. Sabían exactamente qué hacer, nada de respuestas genéricas de foro. Muy profesionales.',
  },
  {
    name: 'Pablo Jiménez',
    role: 'Estudiante de Derecho, UGR',
    initials: 'PJ',
    quote: 'Se me quedó el portátil con Windows pidiendo una actualización justo antes de un examen online. Lo resolvieron por TeamViewer en 20 minutos y llegué a tiempo.',
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

export default async function EstudiantesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const ticketHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <FadeIn>
            <Badge variant="secondary" className="mb-5">Para estudiantes</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
              Tu Mac o tu PC a punto para la entrega, el examen y el TFG.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Soporte técnico para estudiantes universitarios en Granada, en Mac y en PC.
              Rápido, claro y sin tecnicismos. Remoto desde 19€/h.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href={ticketHref}>
                  Solicitar soporte ahora <ArrowRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-2xl font-semibold mb-2">¿Te suena esto?</h2>
          <p className="text-muted-foreground mb-10">Los problemas más habituales que resolvemos para estudiantes.</p>
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
            <h2 className="text-2xl font-semibold mb-2">Lo que hacemos por ti</h2>
            <p className="text-muted-foreground mb-10">Servicios pensados para las necesidades reales de un estudiante.</p>
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
          <h2 className="text-2xl font-semibold mb-8">Por qué elegir Soporte Granada</h2>
        </FadeIn>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Especialistas en Apple y Windows: macOS, iPadOS, iOS y Windows',
            'Soporte remoto vía TeamViewer: sin desplazamientos',
            'Respuesta en menos de 24 horas tras confirmar el soporte',
            'Explicaciones en cristiano, sin tecnicismos innecesarios',
            'Informe detallado de todo lo realizado en cada sesión',
            'Sin suscripciones: pagas solo por las horas que necesitas',
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
            <h2 className="text-2xl font-semibold mb-10 text-center">Estudiantes que ya confían en nosotros</h2>
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
            <h2 className="text-3xl font-bold mb-3">Sin suscripciones. Sin letra pequeña.</h2>
            <p className="opacity-80 mb-8 max-w-md mx-auto">
              Soporte remoto desde <strong>19€/hora</strong>. Pagas solo por el tiempo que usas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/precios`}>
                  Ver precios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href={`/${locale}/faq`}>Preguntas frecuentes</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
