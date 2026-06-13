import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { CheckCircle, Wifi, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('title') };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('services');

  const preventiveItems = [
    'Actualizaciones seguras de macOS, iPadOS e iOS',
    'Configuración y verificación de copias de seguridad',
    'Optimización del rendimiento y almacenamiento',
    'Limpieza de archivos basura y apps duplicadas',
    'Revisión de seguridad y privacidad',
    'Informe de salud del equipo',
  ];

  const correctiveItems = [
    'Mac lento, se calienta o se reinicia solo',
    'Eliminación de malware y adware',
    'Recuperación de cuentas y contraseñas',
    'Recuperación de datos y fotos',
    'Errores al actualizar o pantalla negra',
    'Configuración de correo e iCloud',
    'Migración de datos',
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('intro')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Preventive */}
        <Card>
          <CardHeader>
            <Badge className="w-fit mb-2">Preventivo</Badge>
            <CardTitle className="text-2xl">{t('preventive.title')}</CardTitle>
            <CardDescription>{t('preventive.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {preventiveItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Corrective */}
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">Correctivo</Badge>
            <CardTitle className="text-2xl">{t('corrective.title')}</CardTitle>
            <CardDescription>{t('corrective.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {correctiveItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Modes */}
      <div className="mt-12 max-w-5xl mx-auto">
        <Card className="bg-muted/40 border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center text-center sm:text-left">
              <div className="flex items-center gap-3">
                <Wifi className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Soporte remoto</p>
                  <p className="text-sm text-muted-foreground">Vía TeamViewer, desde donde estés</p>
                </div>
              </div>
              <div className="hidden sm:block text-muted-foreground">·</div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Presencial</p>
                  <p className="text-sm text-muted-foreground">En tu domicilio u oficina en Granada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
