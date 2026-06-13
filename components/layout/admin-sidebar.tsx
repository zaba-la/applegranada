'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Ticket, FileText, Package, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('admin');

  const links = [
    { href: `/${locale}/admin`, label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/admin/clientes`, label: t('nav.customers'), icon: Users },
    { href: `/${locale}/admin/tickets`, label: t('nav.tickets'), icon: Ticket },
    { href: `/${locale}/admin/servicios`, label: 'Servicios', icon: Package },
    { href: `/${locale}/admin/facturas`, label: t('nav.invoices'), icon: FileText },
    { href: `/${locale}/admin/pagos`, label: t('nav.payments'), icon: CreditCard },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-background">
      <div className="p-4 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('title')}
        </p>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
