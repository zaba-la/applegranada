'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
      'Llevaba semanas con el Mac lentísimo y sin espacio. En una sesión remota de 40 minutos lo dejaron como nuevo. Nunca había visto Xcode arrancar tan rápido.',
  },
  {
    name: 'Sofía Navarro',
    role: 'Estudiante de Diseño Gráfico, EASD Granada',
    segment: 'STUDENT',
    initials: 'SN',
    quote:
      'Me configuraron todo el software de Adobe después de actualizar macOS. Sabían exactamente qué hacer, nada de respuestas genéricas de foro. Muy profesionales.',
  },
  // HOGARES
  {
    name: 'Roberto Sánchez',
    role: 'Padre de familia, Granada capital',
    segment: 'HOME',
    initials: 'RS',
    quote:
      'El Mac que usan mis hijos para hacer los deberes se quedó sin arrancar. Lo arreglaron sin que yo tuviera que entender nada de tecnología. Explicaciones claras y precio honesto.',
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
      'Actualizan y mantienen todos los equipos de la clínica fuera de horario de atención. Cero interrupciones con los pacientes. Lo recomiendo a cualquier negocio con Macs.',
  },
  {
    name: 'Elena Martínez',
    role: 'Directora de Marketing, Agencia Nube',
    segment: 'BUSINESS',
    initials: 'EM',
    quote:
      'Tenemos 12 dispositivos Apple en la agencia. La respuesta es siempre rapidísima y entienden perfectamente lo que necesita una empresa que trabaja con plazos ajustados.',
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
          <p className="text-muted-foreground">Más de 200 clientes en Granada confían en AppleGranada.</p>
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
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {visible.map((t) => (
            <Card key={t.name} className="flex flex-col">
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
          ))}
        </div>
      </div>
    </section>
  );
}
