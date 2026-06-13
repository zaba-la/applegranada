'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Mensaje enviado. Te contactaremos pronto.');
    reset();
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-lg text-muted-foreground">
            Cuéntanos qué le pasa a tu equipo. El diagnóstico es gratis y sin compromiso.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact form */}
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input id="phone" type="tel" {...register('phone')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">¿Qué le pasa a tu equipo?</Label>
                  <Textarea id="message" rows={5} {...register('message')} />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">hola@applegranada.es</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Teléfono / WhatsApp</p>
                <p className="text-muted-foreground">+34 600 000 000</p>
                <p className="text-xs text-muted-foreground mt-1">Lunes a viernes, 9:00 – 19:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Zona de servicio presencial</p>
                <p className="text-muted-foreground">Granada y área metropolitana</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-6 mt-8">
              <h3 className="font-semibold mb-2">¿Cuándo te respondemos?</h3>
              <p className="text-sm text-muted-foreground">
                Respondemos todos los mensajes en menos de 24 horas en días laborables.
                Para urgencias, llámanos directamente por teléfono.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
