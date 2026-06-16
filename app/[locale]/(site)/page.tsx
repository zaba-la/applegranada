import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Wrench, Laptop, GraduationCap, Home, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { TestimonialsSection } from '@/components/testimonials-section';
import { LogoCarousel } from '@/components/logo-carousel';
import { authOptions } from '@/lib/auth';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: t('hero.title'), description: t('hero.subtitle') };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const ticketHref = session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`;
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const values = [
    { key: 'preventive', icon: Shield },
    { key: 'corrective', icon: Wrench },
    { key: 'specialist', icon: Laptop },
  ] as const;

  const segments = [
    { key: 'student', icon: GraduationCap, href: `/${locale}/estudiantes` },
    { key: 'home', icon: Home, href: `/${locale}/hogares` },
    { key: 'professional', icon: Briefcase, href: `/${locale}/profesionales` },
    { key: 'business', icon: Building2, href: `/${locale}/empresas` },
  ] as const;

  return (
    <>
      {/* Hero */}
      <FadeIn>
        <section className="relative overflow-hidden">
          <Image
            src="/images/image1.jpg"
            alt=""
            fill
            priority
            className="object-cover animate-bg-zoom"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative container mx-auto px-4 py-24 text-center text-white">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80 mb-10">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={ticketHref}>
                  {tc('buttons.bookDiagnosis')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-white/40 text-white hover:bg-white/10"
              >
                <Link href={`/${locale}/precios`}>{tc('buttons.seePlans')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Logo carousel */}
      <LogoCarousel />

      {/* Values */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ key, icon: Icon }, i) => (
              <FadeIn key={key} delay={i * 100}>
                <Card className="border-0 shadow-none bg-transparent">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="container mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold mb-8 max-w-2xl">{t('segments.title')}</h2>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map(({ key, icon: Icon, href }, i) => (
            <FadeIn key={key} delay={i * 80}>
              <Link href={href} className="block h-full group">
                <Card className="hover:shadow-md transition-shadow h-full group-hover:border-foreground/20">
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
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <FadeIn>
        <section className="relative overflow-hidden py-24">
          <Image
            src="/images/image2.jpg"
            alt=""
            fill
            className="object-cover object-[65%_30%] animate-bg-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
          <div className="relative container mx-auto px-4">
            <div className="max-w-md text-left text-white">
              <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
              <p className="text-lg text-white/80 mb-8">{t('cta.subtitle')}</p>
              <Button size="lg" variant="secondary" asChild>
                <Link href={ticketHref}>
                  {tc('buttons.talkWithUs')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
