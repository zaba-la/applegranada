'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateTicketSchema, type CreateTicketInput } from '@/lib/schemas';

export default function NewTicketPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('dashboard.tickets');
  const [loading, setLoading] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const [serviceMode, setServiceMode] = useState('REMOTE');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateTicketInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateTicketSchema) as any,
    defaultValues: { serviceMode: 'REMOTE', priority: 'MEDIUM' },
  });

  const onSubmit = async (data: CreateTicketInput) => {
    setLoading(true);
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, deviceType, serviceMode }),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Error desconocido' }));
      toast.error(error ?? 'Error al crear el ticket');
      setLoading(false);
      return;
    }

    const ticket = await res.json();
    toast.success(`Ticket creado: ${ticket.ticketCode}`);
    router.push(`/${locale}/panel/tickets`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('new')}</h1>
        <p className="text-muted-foreground">Describe el problema y te ayudamos a resolverlo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles del ticket</CardTitle>
          <CardDescription>Cuanta más información nos des, mejor podremos ayudarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="title">Título del problema</Label>
              <Input id="title" placeholder="Ej: Mi Mac va muy lento desde la última actualización" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Descripción detallada</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="¿Cuándo empezó? ¿Qué mensajes de error ves? ¿Has cambiado algo recientemente?"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Dispositivo</Label>
                <Select onValueChange={(v) => { setDeviceType(v); setValue('deviceType', v as CreateTicketInput['deviceType']); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAC">Mac</SelectItem>
                    <SelectItem value="IPAD">iPad</SelectItem>
                    <SelectItem value="IPHONE">iPhone</SelectItem>
                    <SelectItem value="APPLE_TV">Apple TV</SelectItem>
                    <SelectItem value="MULTIPLE">Múltiples dispositivos</SelectItem>
                  </SelectContent>
                </Select>
                {errors.deviceType && <p className="text-xs text-destructive">{errors.deviceType.message}</p>}
              </div>

              <div className="space-y-1">
                <Label>Prioridad</Label>
                <Select defaultValue="MEDIUM" onValueChange={(v) => setValue('priority', v as CreateTicketInput['priority'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baja — cuando puedas</SelectItem>
                    <SelectItem value="MEDIUM">Media — esta semana</SelectItem>
                    <SelectItem value="HIGH">Alta — urgente</SelectItem>
                    <SelectItem value="URGENT">Urgente — crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Modo de soporte</Label>
              <Select defaultValue="REMOTE" onValueChange={(v) => { setServiceMode(v); setValue('serviceMode', v as CreateTicketInput['serviceMode']); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOTE">Remoto (TeamViewer)</SelectItem>
                  <SelectItem value="ON_SITE">Presencial en Granada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {serviceMode === 'ON_SITE' && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium">Dirección para el soporte presencial</p>
                <div className="space-y-1">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Calle y número" {...register('address')} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" defaultValue="Granada" {...register('city')} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode">Código postal</Label>
                    <Input id="postalCode" {...register('postalCode')} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear ticket'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
