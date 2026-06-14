import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/layout/admin-layout-client';
import { Toaster } from 'react-hot-toast';

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  return (
    <>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster position="bottom-right" />
    </>
  );
}
