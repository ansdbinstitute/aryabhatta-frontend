import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import useUIStore from '../../stores/uiStore';
import Toast from '../ui/Toast';
import ConfirmDialog from '../common/ConfirmDialog';

const AdminLayout = () => {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar();
  }, []);

  return (
    <div className="flex h-screen bg-erp-bg overflow-hidden font-erp w-full">
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 w-full"
        style={{
          marginLeft: sidebarCollapsed ? '72px' : '260px',
        }}
      >
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global UI */}
      <Toast />
      <ConfirmDialog />
    </div>
  );
};

export default AdminLayout;
