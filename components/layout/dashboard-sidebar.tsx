'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Ticket, FileText, User, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('dashboard');

  const links = [
    { href: `/${locale}/panel`, label: t('title'), icon: LayoutDashboard },
    { href: `/${locale}/panel/tickets`, label: t('tickets.title'), icon: Ticket },
    { href: `/${locale}/panel/facturas`, label: t('invoices.title'), icon: FileText },
    { href: `/${locale}/panel/plan`, label: t('plan.title'), icon: CreditCard },
    { href: `/${locale}/panel/cuenta`, label: t('account.title'), icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-background">
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
