import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'plans' });
  return { title: t('title') };
}

export default async function PlansPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('plans');
  const session = await getServerSession(authOptions);

  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ segment: 'asc' }, { priceRemote: 'asc' }],
  });

  const segmentLabel: Record<string, string> = {
    STUDENT: 'Estudiantes',
    HOME: 'Hogar',
    PROFESSIONAL: 'Profesionales',
    BUSINESS: 'Empresas',
  };

  if (plans.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('description')}</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {(['STUDENT', 'HOME', 'PROFESSIONAL', 'BUSINESS'] as const).map((seg) => (
            <Card key={seg} className="relative">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{segmentLabel[seg]}</Badge>
                <CardTitle>Plan {segmentLabel[seg]}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">Desde 19€</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Soporte preventivo mensual', 'Soporte correctivo incluido', 'Respuesta en 24h'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={session ? `/${locale}/panel/plan` : `/${locale}/register`}>
                    {t('selectPlan')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Los planes reales se cargarán cuando añadas datos desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const features = JSON.parse(plan.features) as string[];
          const name = locale === 'es' ? plan.nameEs : plan.nameEn;
          const description = locale === 'es' ? plan.descriptionEs : plan.descriptionEn;

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{segmentLabel[plan.segment]}</Badge>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="mt-3">
                  {plan.priceRemote && (
                    <div>
                      <span className="text-3xl font-bold">{formatCurrency(plan.priceRemote)}</span>
                      <span className="text-muted-foreground text-sm">/mes (remoto)</span>
                    </div>
                  )}
                  {plan.priceOnSite && (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(plan.priceOnSite)}/mes presencial
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {features.map((feature: string) => (
                  <div key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {session ? (
                  <Button className="w-full" asChild>
                    <Link href={`/${locale}/panel/plan?planId=${plan.id}`}>{t('selectPlan')}</Link>
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/${locale}/register`}>{t('notLoggedIn')}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
