export const getAppType = (hostname, searchParams = null) => {
  const domain = hostname?.replace(/^www\./, '').toLowerCase() || '';
  
  const appTypeFromEnv = import.meta.env.VITE_APP_TYPE;
  if (appTypeFromEnv && ['main', 'student', 'erp'].includes(appTypeFromEnv)) {
    return appTypeFromEnv;
  }

  if (searchParams) {
    const appParam = searchParams.get('app');
    if (appParam && ['main', 'student', 'erp'].includes(appParam)) {
      return appParam;
    }
  }
  
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  if (domain === 'ansdb.org' || domain === 'localhost' || domain === '127.0.0.1') {
    if (pathname.startsWith('/erp')) return 'erp';
    if (pathname.startsWith('/student')) return 'student';
    return 'main';
  }
  
  if (domain === 'student.ansdb.org') return 'student';
  if (domain === 'ims.ansdb.org') return 'erp';
  
  return 'main';
};