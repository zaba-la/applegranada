'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Ticket, FileText, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('dashboard');

  const links = [
    { href: `/${locale}/panel`, label: t('title'), icon: LayoutDashboard },
    { href: `/${locale}/panel/tickets`, label: t('tickets.title'), icon: Ticket },
    { href: `/${locale}/panel/facturas`, label: t('invoices.title'), icon: FileText },
    { href: `/${locale}/panel/cuenta`, label: t('account.title'), icon: User },
  ];

  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r bg-background',
        'fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menú</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X className="h-4 w-4" />
        </Button>
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
