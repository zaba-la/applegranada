'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FadeIn } from '@/components/fade-in';

const testimonials = [
  // ESTUDIANTES
  {
    name: 'Laura Moreno',
    role: 'Estudiante de Bellas Artes, UGR',
    segment: 'STUDENT',
    initials: 'LM',
    quote:
      'Se me bloqueó el Mac dos días antes de entregar el TFG. Los llamé por la mañana y esa misma tarde ya lo tenía funcionando. No sé qué hubiera hecho sin ellos.',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Estudiante de Ingeniería Informática, UGR',
    segment: 'STUDENT',
    initials: 'CR',
    quote:
      'Llevaba semanas con el portátil con Windows lentísimo y sin espacio para mis proyectos de la carrera. En una sesión remota de 40 minutos lo dejaron como nuevo, liberando espacio y optimizando el arranque.',
  },
  {
    name: 'Sofía Navarro',
    role: 'Estudiante de Diseño Gráfico, EASD Granada',
    segment: 'STUDENT',
    initials: 'SN',
    quote:
      'Me configuraron todo el software de Adobe después de actualizar macOS. Sabían exactamente qué hacer, nada de respuestas genéricas de foro. Muy profesionales.',
  },
  {
    name: 'Pablo Jiménez',
    role: 'Estudiante de Derecho, UGR',
    segment: 'STUDENT',
    initials: 'PJ',
    quote:
      'Se me quedó el portátil con Windows pidiendo una actualización justo antes de un examen online. Lo resolvieron por TeamViewer en 20 minutos y llegué a tiempo.',
  },
  // HOGARES
  {
    name: 'Roberto Sánchez',
    role: 'Padre de familia, Granada capital',
    segment: 'HOME',
    initials: 'RS',
    quote:
      'El portátil con Windows que usan mis hijos para hacer los deberes se quedó sin arrancar. Lo arreglaron sin que yo tuviera que entender nada de tecnología. Explicaciones claras y precio honesto.',
  },
  {
    name: 'Pilar Torres',
    role: 'Madre de dos hijos, Armilla',
    segment: 'HOME',
    initials: 'PT',
    quote:
      'Recuperaron todas las fotos familiares de los últimos seis años que creíamos perdidas para siempre. No sé cómo lo hicieron, pero imposible ponerle precio a eso.',
  },
  {
    name: 'Francisco Ruiz',
    role: 'Jubilado, Albolote',
    segment: 'HOME',
    initials: 'FR',
    quote:
      'Mis hijos me pusieron el plan mensual para que tuviera el Mac siempre a punto. Ahora tengo videollamadas con los nietos sin cortes y las fotos bien organizadas. Feliz.',
  },
  {
    name: 'Mercedes Aguilar',
    role: 'Madre de tres hijos, Granada capital',
    segment: 'HOME',
    initials: 'MA',
    quote:
      'El portátil con Windows del salón se llenó de ventanas raras y publicidad. Lo limpiaron en remoto el mismo día y nos explicaron cómo evitar que vuelva a pasar.',
  },
  // PROFESIONALES
  {
    name: 'Javier Castillo',
    role: 'Arquitecto autónomo, Granada',
    segment: 'PROFESSIONAL',
    initials: 'JC',
    quote:
      'Mi MacBook Pro es mi herramienta de trabajo. Cuando empezó a fallar con Revit, lo resolvieron en remoto en menos de una hora, un martes por la tarde. Sin perder ni un archivo.',
  },
  {
    name: 'Ana Jiménez',
    role: 'Fotógrafa profesional',
    segment: 'PROFESSIONAL',
    initials: 'AJ',
    quote:
      'Me organizaron el almacenamiento y las copias de seguridad de Lightroom. Por fin sé que mis archivos están seguros y el flujo de trabajo va fluido. Debí haberlo hecho antes.',
  },
  {
    name: 'David Fernández',
    role: 'Diseñador gráfico freelance',
    segment: 'PROFESSIONAL',
    initials: 'DF',
    quote:
      'Llevo dos años con el plan mensual y no he tenido ningún problema serio. Cuando algo falla, lo resuelven ese mismo día. No me imagino trabajando sin este respaldo.',
  },
  {
    name: 'Marta Delgado',
    role: 'Gestora administrativa autónoma',
    segment: 'PROFESSIONAL',
    initials: 'MD',
    quote:
      'Mi portátil con Windows se quedó pillado actualizando justo antes de presentar unos impuestos. Lo resolvieron por TeamViewer esa misma tarde, sin perder ni un archivo.',
  },
  // EMPRESAS
  {
    name: 'María García',
    role: 'CEO, Estudio Colabora Granada',
    segment: 'BUSINESS',
    initials: 'MG',
    quote:
      'Gestionan todos los Macs de nuestro equipo de 8 personas. Antes perdíamos horas cada mes con problemas técnicos; ahora casi nunca pasa nada y cuando pasa lo resuelven rápido.',
  },
  {
    name: 'Antonio López',
    role: 'Gerente, Clínica Dental Sonrisa',
    segment: 'BUSINESS',
    initials: 'AL',
    quote:
      'Actualizan y mantienen todos los PCs con Windows de la clínica fuera de horario de atención. Cero interrupciones con los pacientes. Lo recomiendo a cualquier negocio que dependa de su tecnología.',
  },
  {
    name: 'Elena Martínez',
    role: 'Directora de Marketing, Agencia Nube',
    segment: 'BUSINESS',
    initials: 'EM',
    quote:
      'Tenemos 12 dispositivos Apple en la agencia. La respuesta es siempre rapidísima y entienden perfectamente lo que necesita una empresa que trabaja con plazos ajustados.',
  },
  {
    name: 'Sergio Molina',
    role: 'IT Manager, Constructora Alhambra',
    segment: 'BUSINESS',
    initials: 'SM',
    quote:
      'Migramos 25 portátiles con Windows a Microsoft Intune y ahora configuramos cada equipo nuevo en remoto en menos de una hora. Antes era un caos gestionarlo todo a mano.',
  },
];

const tabs = [
  { key: 'STUDENT', label: 'Estudiantes' },
  { key: 'HOME', label: 'Hogares' },
  { key: 'PROFESSIONAL', label: 'Profesionales' },
  { key: 'BUSINESS', label: 'Empresas' },
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

export function TestimonialsSection() {
  const [active, setActive] = useState('STUDENT');
  const visible = testimonials.filter((t) => t.segment === active);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Lo que dicen nuestros clientes</h2>
          <p className="text-muted-foreground">Más de 200 clientes en Granada confían en Soporte Granada.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                active === tab.key
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {visible.map((t, i) => (
            <FadeIn key={t.name} delay={i * 90}>
            <Card className="flex flex-col h-full">
              <CardContent className="pt-6 flex flex-col gap-4 flex-1">
                <Stars />
                <p className="text-sm leading-relaxed flex-1 text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs font-semibold bg-muted">
                      {t.initials}
                    </AvatarFallback>
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
  );
}
