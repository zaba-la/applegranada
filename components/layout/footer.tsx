import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

export async function Footer() {
  const t = await getTranslations('common');
  const locale = await getLocale();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Logo height={20} />
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Servicios</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/servicios`} className="hover:text-foreground transition-colors">Soporte preventivo</Link></li>
              <li><Link href={`/${locale}/servicios`} className="hover:text-foreground transition-colors">Soporte correctivo</Link></li>
              <li><Link href={`/${locale}/planes`} className="hover:text-foreground transition-colors">Planes</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/sobre-nosotros`} className="hover:text-foreground transition-colors">{t('nav.about')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">{t('nav.blog')}</Link></li>
              <li><Link href={`/${locale}/contacto`} className="hover:text-foreground transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/privacidad`} className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href={`/${locale}/aviso-legal`} className="hover:text-foreground transition-colors">{t('footer.legal')}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="hover:text-foreground transition-colors">{t('footer.cookies')}</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AppleGranada. {t('footer.rights')}.
          </p>
          <div className="flex gap-4">
            <Link href={`/${locale === 'es' ? 'en' : 'es'}${''}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {locale === 'es' ? 'English' : 'Español'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
