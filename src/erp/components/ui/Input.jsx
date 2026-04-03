import React from 'react';
import { classNames } from '../../utils/helpers';
import { AlertCircle, Search, Mail, Phone, User, Lock, Eye, EyeOff } from 'lucide-react';

const iconComponents = {
  search: Search, mail: Mail, phone: Phone, user: User, lock: Lock,
  eye: Eye, eye_off: EyeOff, alert: AlertCircle,
};

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const IconComponent = icon ? iconComponents[icon] || Search : null;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
          <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-300 hover:border-slate-400',
            IconComponent && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
