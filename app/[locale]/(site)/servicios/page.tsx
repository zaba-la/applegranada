import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { CheckCircle, Wifi, MapPin, Cloud, Printer, Router } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('title'), description: t('intro') };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('services');

  const preventiveItems = t.raw('preventive.items') as string[];
  const correctiveItems = t.raw('corrective.items') as string[];
  const softwareItems = t.raw('software.items') as string[];
  const peripheralsItems = t.raw('peripherals.items') as string[];
  const networkingItems = t.raw('networking.items') as string[];

  const moreCategories = [
    { key: 'software', icon: Cloud, items: softwareItems },
    { key: 'peripherals', icon: Printer, items: peripheralsItems },
    { key: 'networking', icon: Router, items: networkingItems },
  ] as const;

  return (
    <div>
      <FadeIn>
        <section className="relative overflow-hidden">
          <Image
            src="/images/image3.jpg"
            alt=""
            fill
            priority
            className="object-cover object-right-top animate-bg-zoom"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative container mx-auto px-4 py-24 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">{t('intro')}</p>
          </div>
        </section>
      </FadeIn>

      <div className="container mx-auto px-4 py-16">
      <FadeIn delay={40}>
        <div className="mb-16 max-w-5xl mx-auto">
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

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <FadeIn delay={0}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">{t('preventive.title')}</CardTitle>
              <CardDescription>{t('preventive.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {preventiveItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
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
              <CardTitle className="text-2xl">{t('corrective.title')}</CardTitle>
              <CardDescription>{t('corrective.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {correctiveItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={120}>
        <div className="max-w-5xl mx-auto mt-16 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">{t('moreTitle')}</h2>
          <p className="text-muted-foreground">{t('moreSubtitle')}</p>
        </div>
      </FadeIn>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {moreCategories.map(({ key, icon: Icon, items }, i) => (
          <FadeIn key={key} delay={140 + i * 60}>
            <Card className="h-full">
              <CardHeader>
                <Icon className="h-6 w-6 text-muted-foreground mb-2" />
                <CardTitle className="text-xl">{t(`${key}.title`)}</CardTitle>
                <CardDescription>{t(`${key}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      </div>
    </div>
  );
}
