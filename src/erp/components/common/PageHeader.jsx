import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const PageHeader = ({
  title,
  subtitle,
  actions,
  children,
  showBack,
  backTo,
  backLabel = 'Back',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isErpRoute = location.pathname.startsWith('/erp');
  const isDashboard = location.pathname === '/erp' || location.pathname === '/erp/dashboard';
  const erpPathDepth = location.pathname.split('/').filter(Boolean).length;
  const isInnerErpPage = isErpRoute && erpPathDepth >= 3;
  const shouldShowBack = showBack ?? (isInnerErpPage && !isDashboard);

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/erp/dashboard');
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {shouldShowBack && (
            <div className="mb-3">
              <Button variant="ghost" size="sm" icon="back" onClick={handleBack}>
                {backLabel}
              </Button>
            </div>
          )}
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
          {subtitle && (
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
