import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export const metadata = { title: 'Blog | AppleGranada' };

const posts = [
  {
    slug: 'como-mantener-mac-rapido',
    title: 'Cómo mantener tu Mac siempre rápido',
    description: 'Cinco hábitos que marcan la diferencia entre un Mac que dura años y uno que empieza a fallar al tercer año.',
    category: 'Preventivo',
    date: '2026-05-20',
  },
  {
    slug: 'backup-icloud-vs-time-machine',
    title: 'iCloud vs Time Machine: ¿cuál necesitas (o los dos)?',
    description: 'Muchos usuarios creen que iCloud es suficiente como copia de seguridad. Aquí te explicamos por qué no lo es.',
    category: 'Consejos',
    date: '2026-05-10',
  },
  {
    slug: 'malware-en-mac-senales',
    title: '¿Tiene tu Mac malware? Las señales que no debes ignorar',
    description: 'El malware en Mac existe y es cada vez más sofisticado. Aquí van las señales de alerta más comunes.',
    category: 'Seguridad',
    date: '2026-04-28',
  },
  {
    slug: 'actualizar-macos-sin-perder-datos',
    title: 'Actualizar macOS sin miedo: guía paso a paso',
    description: 'Actualizar el sistema operativo no tiene que ser una aventura. Así lo hacemos nosotros con cada cliente.',
    category: 'Tutoriales',
    date: '2026-04-15',
  },
];

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn>
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Consejos prácticos sobre el cuidado de tus dispositivos Apple. Sin tecnicismos, en cristiano.
          </p>
        </div>
      </FadeIn>

      <div className="max-w-3xl mx-auto grid gap-5">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 80}>
            <Link href={`/${locale}/blog/${post.slug}`} className="block group">
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:underline underline-offset-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
