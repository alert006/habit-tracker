import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-paper dark:bg-charcoal">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </div>
      <MobileNav />
    </div>
  );
}
