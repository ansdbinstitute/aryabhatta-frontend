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
  
  if (domain === 'ansdb.org') return 'main';
  if (domain === 'student.ansdb.org') return 'student';
  if (domain === 'ims.ansdb.org') return 'erp';
  
  return 'main';
};