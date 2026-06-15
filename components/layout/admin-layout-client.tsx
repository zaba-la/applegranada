'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminNavbar } from './admin-navbar';
import { AdminSidebar } from './admin-sidebar';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar role="ADMIN" onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 relative overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
