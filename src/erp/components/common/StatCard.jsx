import React from 'react';
import { classNames } from '../../utils/helpers';
import { TrendingUp, TrendingDown, Minus, LayoutDashboard, GraduationCap, BookOpen, Users, Building, Bell, ClipboardList, Settings, Clock, Shield, CheckCircle, FileText } from 'lucide-react';

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-slate-400',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const iconComponents = {
  dashboard: LayoutDashboard, school: GraduationCap, menu_book: BookOpen,
  groups: Users, account_balance: Building, campaign: Bell,
  fact_check: ClipboardList, settings: Settings, pending: Clock,
  manage_accounts: Users, check_circle: CheckCircle,
};

const StatCard = ({ title, value, icon, trend, trendLabel, color = 'primary', className = '' }) => {
  const iconBg = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
    accent: 'bg-accent/10 text-accent',
  };

  const IconComponent = icon ? (iconComponents[icon] || LayoutDashboard) : null;
  const TrendIcon = trendIcons[trend] || null;

  return (
    <div className={classNames(
      'bg-white rounded-xl border border-erp-border p-5 hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          {(trend || trendLabel) && (
            <div className="flex items-center gap-1.5">
              {TrendIcon && (
                <TrendIcon className={classNames('w-4 h-4', trendColors[trend])} />
              )}
              {trendLabel && (
                <span className={classNames('text-xs font-medium', trendColors[trend] || 'text-slate-400')}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {IconComponent && (
          <div className={classNames(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            iconBg[color] || iconBg.primary
          )}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
