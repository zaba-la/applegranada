import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Heart, Award, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: `${t('title')} | AppleGranada` };
}

const valueIcons = { honesty: Heart, specialization: Award, punctuality: Clock, personal: Users };
const valueKeys = ['honesty', 'specialization', 'punctuality', 'personal'] as const;

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <FadeIn>
          <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
          <div className="prose text-muted-foreground mb-12 space-y-4">
            <p className="text-lg">{t('intro1')}</p>
            <p>{t('intro2')}</p>
            <p>{t('intro3')}</p>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <h2 className="text-2xl font-bold mb-6">{t('valuesTitle')}</h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {valueKeys.map((key, i) => {
            const Icon = valueIcons[key];
            return (
              <FadeIn key={key} delay={100 + i * 80}>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-base">{t(`values.${key}.title`)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t(`values.${key}.description`)}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={100}>
          <div className="rounded-lg bg-muted/40 p-8">
            <h2 className="text-xl font-semibold mb-3">{t('locationTitle')}</h2>
            <p className="text-muted-foreground">{t('locationText')}</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
