import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { AdminNavbar } from '@/components/layout/admin-navbar';
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
    <div className="flex min-h-screen flex-col">
      <AdminNavbar role="CUSTOMER" />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
