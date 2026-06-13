import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { CheckCircle, Wifi, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('title') };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('services');

  const preventiveItems = t.raw('preventive.items') as string[];
  const correctiveItems = t.raw('corrective.items') as string[];

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn>
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('intro')}</p>
        </div>
      </FadeIn>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <FadeIn delay={0}>
          <Card className="h-full">
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
        </FadeIn>

        <FadeIn delay={100}>
          <Card className="h-full">
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
        </FadeIn>
      </div>

      <FadeIn delay={150}>
        <div className="mt-12 max-w-5xl mx-auto">
          <Card className="bg-muted/40 border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <Wifi className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('modeRemote')}</p>
                    <p className="text-sm text-muted-foreground">{t('modeRemoteDesc')}</p>
                  </div>
                </div>
                <div className="hidden sm:block text-muted-foreground">·</div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('modeOnsite')}</p>
                    <p className="text-sm text-muted-foreground">{t('modeOnsiteDesc')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
