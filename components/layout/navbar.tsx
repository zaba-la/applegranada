'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const altLocale = locale === 'es' ? 'en' : 'es';
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '';
  const altHref = `/${altLocale}${pathnameWithoutLocale}`;

  const nav = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/servicios`, label: t('nav.services') },
    { href: `/${locale}/precios`, label: t('nav.plans') },
    { href: `/${locale}/sobre-nosotros`, label: t('nav.about') },
    { href: `/${locale}/blog`, label: t('nav.blog') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/contacto`, label: t('nav.contact') },
  ];

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center">
          <Logo height={22} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-1">
          {/* Language */}
          <Link
            href={altHref}
            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </Link>

          {/* Theme */}
          <ThemeToggle />

          {/* Auth */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{session.user.name}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">{session.user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/panel`}>{t('nav.dashboard')}</Link>
                </DropdownMenuItem>
                {(session.user as { role?: string }).role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/admin`}>{t('nav.admin')}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: `/${locale}` })}>
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/login`}>{t('nav.login')}</Link>
              </Button>
              <Button size="sm" asChild className="ml-1">
                <Link href={session ? `/${locale}/panel/tickets/nuevo` : `/${locale}/register`}>{t('buttons.bookDiagnosis')}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm py-1"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t space-y-2">
            {session ? (
              <>
                <Link href={`/${locale}/panel`} className="block text-sm py-1" onClick={() => setMenuOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="block text-sm py-1 text-left w-full"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="block text-sm py-1" onClick={() => setMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link href={`/${locale}/register`} className="block text-sm py-1 font-medium" onClick={() => setMenuOpen(false)}>
                  {t('buttons.bookDiagnosis')}
                </Link>
              </>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Link href={altHref} className="text-sm text-muted-foreground">
                {locale === 'es' ? 'English' : 'Español'}
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
