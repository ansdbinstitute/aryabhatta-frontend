import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  useEffect(() => {
    // Top-Level domain redirect for specific vanity ERP links
    if (window.location.hostname === 'ims.ansdb.org' && window.location.pathname === '/') {
      window.location.replace('https://ansdb.org/erp/login?portal=institute');
    }
  }, []);

  return <AppRoutes />;
}

export default App;