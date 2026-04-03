import React from 'react';
import { classNames } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const colorClasses = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
};

const Badge = ({ children, variant = 'neutral', dot = false, size = 'sm', className = '' }) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        colorClasses[variant] || colorClasses.neutral,
        className
      )}
    >
      {dot && (
        <span className={classNames('w-1.5 h-1.5 rounded-full', dotColors[variant] || dotColors.neutral)} />
      )}
      {children}
    </span>
  );
};

/**
 * StatusBadge — auto-maps status string to color
 */
export const StatusBadge = ({ status, className = '' }) => {
  const variant = STATUS_COLORS[status] || 'neutral';
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '—';

  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
};

export default Badge;
