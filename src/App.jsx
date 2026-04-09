import React, { useEffect, useRef, useState, useMemo } from 'react';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import ErpRoutes from './erp/routes/ErpRoutes';
import StudentPortalRoutes from './student/routes/StudentPortalRoutes';
import { getAppType } from './utils/domainRouter';

function App() {
  const [appType, setAppType] = useState('main');
  const initialized = useRef(false);

  const searchParams = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return null;
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    try {
      const type = getAppType(window.location.hostname, searchParams);
      setAppType(type);
    } catch (e) {
      console.error('Error getting app type:', e);
      setAppType('main');
    }
  }, [searchParams]);

  if (appType === 'student') return <StudentPortalRoutes />;
  if (appType === 'erp') return <ErpRoutes />;
  
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;