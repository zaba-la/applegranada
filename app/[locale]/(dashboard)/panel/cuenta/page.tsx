'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UpdateCustomerSchema, type UpdateCustomerInput } from '@/lib/schemas';

export default function AccountPage() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard.account');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Record<string, string> | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UpdateCustomerInput>({
    resolver: zodResolver(UpdateCustomerSchema),
  });

  useEffect(() => {
    fetch('/api/customers/me')
      .then((r) => r.json())
      .then((data) => {
        setCustomer(data);
        reset({
          name: data.user?.name ?? '',
          email: data.user?.email ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          postalCode: data.postalCode ?? '',
          country: data.country ?? 'ES',
          company: data.company ?? '',
        });
      })
      .catch(() => null);
  }, [reset]);

  const onSubmit = async (data: UpdateCustomerInput) => {
    setLoading(true);
    const res = await fetch('/api/customers/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Perfil actualizado');
    } else {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{session?.user?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('profile')}</CardTitle>
          <CardDescription>Actualiza tus datos de contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" {...register('phone')} />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="company">Empresa (opcional)</Label>
              <Input id="company" {...register('company')} />
            </div>

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" {...register('address')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" {...register('city')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="postalCode">Código postal</Label>
                <Input id="postalCode" {...register('postalCode')} />
              </div>
              <div className="space-y-1">
                <Label>País</Label>
                <Select defaultValue="ES" onValueChange={(v) => setValue('country', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">España</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
