import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './erp/stores/authStore';
import useStudentAuthStore from './student/stores/studentAuthStore';
import useRolePermissionStore from './erp/stores/rolePermissionStore';

/**
 * Layout wrapper — applies MainLayout only for public pages
 * ERP and student portal pages have their own layouts
 */
const LayoutWrapper = () => {
  const location = useLocation();
  const isErpRoute = location.pathname.startsWith('/erp');
  const isStudentPortalRoute = location.pathname.startsWith('/student');

  if (isErpRoute || isStudentPortalRoute) {
    return <AppRoutes />;
  }

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

function App() {
  const hasLoggedAuthDebug = useRef(false);
  const isInitialized = useRef(false);

  // Single initialization effect - runs once on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const init = async () => {
      // Initialize both auth systems
      // Use getState() to get stable function references
      await useAuthStore.getState().initialize();
      await useStudentAuthStore.getState().initialize();
    };

    init();
  }, []);

  // Auth state for logging purposes only
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (import.meta.env.DEV && !hasLoggedAuthDebug.current) {
      console.info('[ANSDB Auth]', {
        isAuthenticated,
        userId: user?.id ?? null,
        username: user?.username ?? null,
        email: user?.email ?? null,
        roleType: user?.roleType ?? null,
        branchId: user?.branch?.id ?? null,
      });

      if (isAuthenticated || user === null) {
        hasLoggedAuthDebug.current = true;
      }
    }
  }, [isAuthenticated, user]);

  return <LayoutWrapper />;
}

export default App;
