'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneInput } from '@/components/ui/phone-input';
import { ContactSchema } from '@/lib/schemas';

type FormData = z.infer<typeof ContactSchema>;

const WA_NUMBER = '34644411252';
const WA_LINK = `https://wa.me/${WA_NUMBER}`;
const EMAIL = 'soporte@soportegranada.com';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success(t('successMsg'));
      reset();
      setPhone('');
    } catch {
      toast.error(t('errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>{t('formTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">{t('fieldName')}</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">{t('fieldEmail')}</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">{t('fieldPhone')}</Label>
                  <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={(v) => { setPhone(v); setValue('phone', v); }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">{t('fieldMessage')}</Label>
                  <Textarea id="message" rows={5} {...register('message')} />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('submitting') : t('submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <div className="space-y-6">

            {/* WhatsApp — destacado */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20 hover:border-green-500/60 transition-colors group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400 group-hover:underline">
                  {t('infoWhatsapp')}
                </p>
                <p className="text-muted-foreground">+34 644 41 12 52</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('infoHours')}</p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{t('infoEmail')}</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            {/* Zona de servicio */}
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{t('infoLocation')}</p>
                <p className="text-muted-foreground">{t('infoLocationValue')}</p>
              </div>
            </div>

            {/* Respuesta */}
            <div className="rounded-lg bg-muted/40 p-6 mt-2">
              <h3 className="font-semibold mb-2">{t('responseTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('responseText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
