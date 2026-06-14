'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminNavbar } from './admin-navbar';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar role="CUSTOMER" onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
