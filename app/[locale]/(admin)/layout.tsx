import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminNavbar } from '@/components/layout/admin-navbar';
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
    <div className="flex min-h-screen flex-col">
      <AdminNavbar role="ADMIN" />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
