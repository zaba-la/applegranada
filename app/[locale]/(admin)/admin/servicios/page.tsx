import { prisma } from '@/lib/prisma';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Laptop, MapPin, Check, Ticket, Euro } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Servicios — Admin' };

type Props = { params: { locale: string } };

const SERVICES = [
  {
    id: 'REMOTE',
    icon: Laptop,
    title: 'Soporte Remoto',
    rate: 19,
    minimumLabel: 'Mínimo 1 hora',
    minimumAmount: 19,
    via: 'TeamViewer',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    features: [
      'Diagnóstico y resolución de software',
      'Configuración de macOS, iPadOS e iOS',
      'Gestión de iCloud, Google Drive y Microsoft 365',
      'Optimización del rendimiento del sistema',
      'Copias de seguridad y recuperación de datos',
    ],
  },
  {
    id: 'ON_SITE',
    icon: MapPin,
    title: 'Soporte Presencial',
    rate: 39,
    minimumLabel: 'Mínimo 2 horas',
    minimumAmount: 78,
    via: 'Granada (domicilio o negocio)',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400',
    features: [
      'Todo lo del soporte remoto',
      'Configuración de equipos y redes locales',
      'Migración de datos entre dispositivos',
      'Instalación y configuración inicial de equipos',
      'Formación personalizada básica',
    ],
  },
] as const;

export default async function AdminServiciosPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const [remoteTotal, onsiteTotal, remoteOpen, onsiteOpen] = await Promise.all([
    prisma.ticket.count({ where: { serviceMode: 'REMOTE' } }),
    prisma.ticket.count({ where: { serviceMode: 'ON_SITE' } }),
    prisma.ticket.count({ where: { serviceMode: 'REMOTE', status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.ticket.count({ where: { serviceMode: 'ON_SITE', status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
  ]);

  const stats: Record<string, { total: number; open: number }> = {
    REMOTE: { total: remoteTotal, open: remoteOpen },
    ON_SITE: { total: onsiteTotal, open: onsiteOpen },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Servicios</h1>
        <p className="text-muted-foreground">2 servicios activos · facturación por hora</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {SERVICES.map(({ id, icon: Icon, title, rate, minimumLabel, minimumAmount, via, color, features }) => {
          const { total, open } = stats[id];
          return (
            <Card key={id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{via}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">Activo</Badge>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{rate}€</span>
                  <span className="text-muted-foreground">/hora</span>
                </div>
                <p className="text-sm text-muted-foreground">{minimumLabel} · mínimo {minimumAmount}€</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-5">
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tickets abiertos</p>
                      <p className="text-lg font-semibold">{open}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total tickets</p>
                      <p className="text-lg font-semibold">{total}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
