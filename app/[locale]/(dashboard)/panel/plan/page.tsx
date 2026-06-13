import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata = { title: 'Mi plan' };

export default async function PlanPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const t = await getTranslations('dashboard.plan');

  const customer = await prisma.customer.findFirst({
    where: { user: { email: session!.user.email } },
    include: {
      plan: true,
      subscription: { include: { plan: true } },
    },
  });

  const plan = customer?.plan;
  const subscription = customer?.subscription;

  if (!plan) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">No tienes ningún plan activo</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Elige un plan para empezar a disfrutar del soporte AppleGranada
            </p>
            <Button asChild>
              <Link href={`/${locale}/precios`}>
                Ver planes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = JSON.parse(plan.features) as string[];
  const planName = locale === 'es' ? plan.nameEs : plan.nameEn;
  const planDesc = locale === 'es' ? plan.descriptionEs : plan.descriptionEn;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('current')}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{planName}</CardTitle>
              <CardDescription>{planDesc}</CardDescription>
            </div>
            {subscription && (
              <Badge className={subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {subscription.status}
              </Badge>
            )}
          </div>
          <div className="mt-3">
            {plan.priceRemote && (
              <span className="text-2xl font-bold">{formatCurrency(plan.priceRemote)}/mes</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Características incluidas</p>
            <ul className="space-y-2">
              {features.map((feature: string) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {subscription && (
            <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
              <p>Inicio: {formatDate(subscription.startDate)}</p>
              {subscription.endDate && <p>Fin: {formatDate(subscription.endDate)}</p>}
              <p>Modo: {subscription.serviceMode === 'REMOTE' ? 'Remoto' : 'Presencial'}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/precios`}>{t('upgrade')}</Link>
            </Button>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              {t('cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
