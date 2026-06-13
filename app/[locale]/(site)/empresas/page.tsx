import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Building2, Star, Wifi,
  Users, Shield, Settings, BarChart, MapPin, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata() {
  return {
    title: 'Soporte técnico Apple para empresas en Granada | AppleGranada',
    description:
      'Gestión y mantenimiento de dispositivos Apple para empresas en Granada. Mac, iPad e iPhone. Sin interrupciones, sin tiempos de inactividad. Soporte remoto y presencial.',
    openGraph: {
      title: 'Soporte Apple para Empresas en Granada',
      description: 'Mantenemos todos los Macs de tu empresa funcionando. Soporte técnico Apple gestionado para equipos de trabajo en Granada.',
    },
  };
}

const problems = [
  { icon: Users, text: 'El equipo pierde horas cada semana por problemas técnicos con los Macs' },
  { icon: Settings, text: 'Nuevas incorporaciones sin equipo configurado a tiempo ni acceso a las herramientas' },
  { icon: Shield, text: 'Sin política clara de seguridad, backups ni actualizaciones en la empresa' },
  { icon: BarChart, text: 'Ningún proveedor conoce a fondo el ecosistema Apple para dar soporte real' },
];

const activities = [
  {
    icon: RefreshCw,
    title: 'Mantenimiento periódico de la flota',
    desc: 'Actualizamos y mantenemos todos los dispositivos Apple de la empresa fuera del horario laboral para no interrumpir la actividad. Informe de estado de cada equipo.',
  },
  {
    icon: Users,
    title: 'Onboarding de nuevas incorporaciones',
    desc: 'Configuramos el Mac, las cuentas de empresa, las apps y los accesos de cada nuevo empleado. El equipo listo desde el primer día sin que nadie lo tenga que gestionar internamente.',
  },
  {
    icon: Shield,
    title: 'Política de seguridad y backups',
    desc: 'Definimos e implementamos copias de seguridad, cifrado de dispositivos, gestión de contraseñas y configuración de privacidad para cumplir con los requisitos de seguridad empresarial.',
  },
  {
    icon: Wifi,
    title: 'Soporte técnico para el equipo',
    desc: 'Canal directo de soporte para los empleados. Cuando alguien tiene un problema con su Mac o iPhone, lo resolvemos en remoto ese mismo día sin que tengan que buscar soluciones por su cuenta.',
  },
];

const testimonials = [
  {
    name: 'María García',
    role: 'CEO, Estudio Colabora Granada',
    initials: 'MG',
    quote: 'Gestionan todos los Macs de nuestro equipo de 8 personas. Antes perdíamos horas cada mes con problemas técnicos; ahora casi nunca pasa nada y cuando pasa lo resuelven rápido.',
  },
  {
    name: 'Antonio López',
    role: 'Gerente, Clínica Dental Sonrisa',
    initials: 'AL',
    quote: 'Actualizan y mantienen todos los equipos de la clínica fuera de horario de atención. Cero interrupciones con los pacientes. Lo recomiendo a cualquier negocio con Macs.',
  },
  {
    name: 'Elena Martínez',
    role: 'Directora de Marketing, Agencia Nube',
    initials: 'EM',
    quote: 'Tenemos 12 dispositivos Apple en la agencia. La respuesta es siempre rapidísima y entienden perfectamente lo que necesita una empresa que trabaja con plazos ajustados.',
  },
];

const useCases = [
  { sector: 'Estudios de diseño y agencias', detail: 'Soporte a toda la flota creativa con Adobe CC, Figma y Sketch. Configuración de almacenamiento compartido.' },
  { sector: 'Clínicas y centros médicos', detail: 'Mantenimiento sin interrupciones en horario fuera de consultas. Gestión de equipos en recepción y consulta.' },
  { sector: 'Despachos y consultoras', detail: 'Microsoft 365, OneDrive, VPN y políticas de seguridad para equipos legales y financieros.' },
  { sector: 'Comercios y hostelería', detail: 'Configuración y mantenimiento de iPads para gestión, TPV y comunicación interna.' },
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

export default function EmpresasPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div>
      {/* Hero */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <FadeIn>
            <Badge variant="secondary" className="mb-5">Para empresas y equipos</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
              Todos los Macs de tu empresa, funcionando.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Soporte técnico Apple para empresas en Granada. Mantenemos tu flota de dispositivos
              actualizada y segura para que tu equipo no pierda ni un minuto de trabajo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href={`/${locale}/contacto`}>
                  Habla con nosotros <ArrowRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-2xl font-semibold mb-2">El coste oculto del soporte técnico sin gestionar</h2>
          <p className="text-muted-foreground mb-10">Problemas habituales en empresas que no tienen soporte Apple especializado.</p>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
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
            <h2 className="text-2xl font-semibold mb-2">Soporte técnico Apple para tu empresa</h2>
            <p className="text-muted-foreground mb-10">Gestión integral del ecosistema Apple para que tu equipo pueda trabajar sin interrupciones.</p>
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

      {/* Sectores */}
      <section className="container mx-auto px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-3">Empresas a las que ayudamos en Granada</h2>
          <p className="text-muted-foreground mb-8">Sectores con los que trabajamos habitualmente.</p>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
          {useCases.map(({ sector, detail }, i) => (
            <FadeIn key={sector} delay={i * 60}>
              <div className="p-5 rounded-xl border bg-background">
                <p className="font-semibold text-sm mb-1">{sector}</p>
                <p className="text-sm text-muted-foreground">{detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Por qué AppleGranada */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-8">Lo que diferencia a AppleGranada para empresas</h2>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Mantenimiento fuera del horario laboral para no interrumpir la actividad',
              'Informe técnico de cada intervención para el equipo de administración',
              'Onboarding de nuevas incorporaciones el mismo día de su llegada',
              'Gestión de flota: actualizaciones, licencias y configuraciones unificadas',
              'Soporte presencial a domicilio en Granada y área metropolitana',
              'Soporte remoto para empleados en otros lugares de España',
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
            <h2 className="text-2xl font-semibold mb-10 text-center">Empresas de Granada que ya confían en nosotros</h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
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

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <FadeIn>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-3">Hablemos sobre tu empresa.</h2>
            <p className="opacity-80 mb-8 max-w-md mx-auto">
              Cada empresa es diferente. Cuéntanos cuántos equipos tenéis y qué necesitáis.
              Os proponemos la mejor solución sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/contacto`}>
                  Contactar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href={`/${locale}/precios`}>Ver precios</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
