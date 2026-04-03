import React from 'react';
import useUIStore from '../../stores/uiStore';
import { classNames } from '../../utils/helpers';
import { CheckCircle, AlertCircle, AlertOctagon, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertOctagon,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

const Toast = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const IconComponent = iconMap[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={classNames(
              'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
              'animate-in slide-in-from-right-5 fade-in duration-300',
              colorMap[toast.type] || colorMap.info
            )}
          >
            <IconComponent className={classNames('w-5 h-5 mt-0.5', iconColorMap[toast.type])} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
