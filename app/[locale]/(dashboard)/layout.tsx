import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { DashboardLayoutClient } from '@/components/layout/dashboard-layout-client';
import { Toaster } from 'react-hot-toast';

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if ((session.user as { role?: string }).role === 'ADMIN') {
    redirect(`/${locale}/admin`);
  }

  return (
    <>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
      <Toaster position="bottom-right" />
    </>
  );
}
