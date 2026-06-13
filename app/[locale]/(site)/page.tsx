import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, Shield, Wrench, Apple, GraduationCap, Home, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: t('hero.title') };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const values = [
    { key: 'preventive', icon: Shield },
    { key: 'corrective', icon: Wrench },
    { key: 'specialist', icon: Apple },
  ] as const;

  const segments = [
    { key: 'student', icon: GraduationCap },
    { key: 'home', icon: Home },
    { key: 'professional', icon: Briefcase },
    { key: 'business', icon: Building2 },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6">
          {t('hero.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={`/${locale}/contacto`}>
              {tc('buttons.bookDiagnosis')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/${locale}/planes`}>{tc('buttons.seePlans')}</Link>
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ key, icon: Icon }) => (
              <Card key={key} className="border-0 shadow-none bg-transparent">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{t(`values.${key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(`values.${key}.description`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold mb-8 max-w-2xl">{t('segments.title')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map(({ key, icon: Icon }) => (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Icon className="h-6 w-6 mb-2 text-muted-foreground" />
                <CardTitle className="text-base">
                  {t(`segments.${key}`).split(' — ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t(`segments.${key}`).split(' — ')[1]}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/${locale}/contacto`}>
              {tc('buttons.talkWithUs')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
