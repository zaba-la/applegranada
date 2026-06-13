'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreatePlanSchema, type CreatePlanInput } from '@/lib/schemas';

type Plan = {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  priceRemote: number | null;
  priceOnSite: number | null;
  segment: string;
  isActive: boolean;
  features: string;
};

const segmentLabel: Record<string, string> = {
  STUDENT: 'Estudiante', HOME: 'Hogar', PROFESSIONAL: 'Profesional', BUSINESS: 'Empresa',
};

export default function AdminPlansPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('admin.plans');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [featuresText, setFeaturesText] = useState('');
  const [segment, setSegment] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreatePlanInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlanSchema) as any,
  });

  const fetchPlans = async () => {
    const res = await fetch('/api/plans');
    if (res.ok) setPlans(await res.json());
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFeaturesText('');
    setSegment('');
    reset({});
    setOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    const features = JSON.parse(plan.features) as string[];
    setFeaturesText(features.join('\n'));
    setSegment(plan.segment);
    reset({
      nameEs: plan.nameEs,
      nameEn: plan.nameEn,
      descriptionEs: plan.descriptionEs,
      descriptionEn: plan.descriptionEs,
      priceRemote: plan.priceRemote ?? undefined,
      priceOnSite: plan.priceOnSite ?? undefined,
      segment: plan.segment as CreatePlanInput['segment'],
      features: features,
    });
    setOpen(true);
  };

  const onSubmit = async (data: CreatePlanInput) => {
    setLoading(true);
    const features = featuresText.split('\n').map((f) => f.trim()).filter(Boolean);
    const body = { ...data, features, segment };
    const url = editing ? `/api/plans/${editing.id}` : '/api/plans';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setLoading(false);
    if (res.ok) {
      toast.success(editing ? 'Plan actualizado' : 'Plan creado');
      setOpen(false);
      fetchPlans();
    } else {
      toast.error('Error al guardar el plan');
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('¿Eliminar este plan?')) return;
    const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Plan eliminado'); fetchPlans(); }
    else toast.error('Error al eliminar');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{plans.length} planes</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> {t('new')}
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>{t('empty')}</p>
            <Button onClick={openCreate} className="mt-4">Crear primer plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{segmentLabel[plan.segment]}</Badge>
                    <CardTitle className="text-base">{plan.nameEs}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deletePlan(plan.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {plan.priceRemote && <p>Remoto: {plan.priceRemote}€/mes</p>}
                  {plan.priceOnSite && <p>Presencial: {plan.priceOnSite}€/mes</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t('edit') : t('new')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{t('nameEs')}</Label>
                <Input {...register('nameEs')} />
                {errors.nameEs && <p className="text-xs text-destructive">{errors.nameEs.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>{t('nameEn')}</Label>
                <Input {...register('nameEn')} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Descripción (ES)</Label>
              <Textarea {...register('descriptionEs')} rows={2} />
            </div>
            <div className="space-y-1">
              <Label>Descripción (EN)</Label>
              <Textarea {...register('descriptionEn')} rows={2} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{t('priceRemote')}</Label>
                <Input type="number" step="0.01" {...register('priceRemote', { valueAsNumber: true })} />
              </div>
              <div className="space-y-1">
                <Label>{t('priceOnSite')}</Label>
                <Input type="number" step="0.01" {...register('priceOnSite', { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>{t('segment')}</Label>
              <Select value={segment} onValueChange={(v) => { setSegment(v); setValue('segment', v as CreatePlanInput['segment']); }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Estudiante</SelectItem>
                  <SelectItem value="HOME">Hogar</SelectItem>
                  <SelectItem value="PROFESSIONAL">Profesional</SelectItem>
                  <SelectItem value="BUSINESS">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>{t('features')} (una por línea)</Label>
              <Textarea
                rows={5}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Soporte preventivo mensual&#10;Respuesta en 24h&#10;..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
