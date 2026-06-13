import { unstable_setRequestLocale } from 'next-intl/server';
import { Heart, Award, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';

export const metadata = { title: 'Sobre nosotros | AppleGranada' };

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  const values = [
    { icon: Heart, title: 'Honestidad', description: 'Te decimos la verdad aunque no sea lo que quieres oír. Sin sorpresas en la factura.' },
    { icon: Award, title: 'Especialización', description: 'Solo Apple. Eso nos permite conocer el ecosistema a fondo y darte el mejor servicio.' },
    { icon: Clock, title: 'Puntualidad', description: 'Respetamos tu tiempo. Confirmamos citas y cumplimos los plazos que prometemos.' },
    { icon: Users, title: 'Trato personal', description: 'Tienes un interlocutor fijo que conoce tu equipo y tu historial. Sin call centers.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <FadeIn>
          <h1 className="text-4xl font-bold mb-6">Sobre AppleGranada</h1>
          <div className="prose text-muted-foreground mb-12 space-y-4">
            <p className="text-lg">
              Somos un servicio técnico de software especializado exclusivamente en el ecosistema Apple,
              con sede en Granada. Nació de la frustración de ver cómo usuarios de Mac, iPhone e iPad
              perdían horas (y datos) por no tener a nadie de confianza a quien llamar.
            </p>
            <p>
              No hacemos hardware, no reparamos pantallas, no vendemos accesorios. Solo software Apple,
              y lo hacemos muy bien. Eso significa que cuando nos llamas, estás hablando con alguien que
              conoce macOS, iOS e iPadOS de verdad, no con un técnico genérico que abre el ordenador e
              improvisa.
            </p>
            <p>
              Trabajamos en remoto con TeamViewer (sin necesidad de desplazarte) y de forma presencial
              en tu domicilio u oficina dentro de Granada y alrededores.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <h2 className="text-2xl font-bold mb-6">Nuestros valores</h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {values.map(({ icon: Icon, title, description }, i) => (
            <FadeIn key={title} delay={100 + i * 80}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-base">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={100}>
          <div className="rounded-lg bg-muted/40 p-8">
            <h2 className="text-xl font-semibold mb-3">¿Dónde estamos?</h2>
            <p className="text-muted-foreground">
              Atendemos principalmente en Granada y área metropolitana. El soporte remoto está disponible
              para cualquier lugar de España. Para soporte presencial fuera de Granada, consúltanos.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
