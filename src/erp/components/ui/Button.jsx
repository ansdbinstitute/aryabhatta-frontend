import React from 'react';
import { classNames } from '../../utils/helpers';
import {
  Plus, Edit2, Trash2, Eye, Search, Filter, Save, Download,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Check, Settings, User, Lock, ArrowLeft, ArrowRight,
  Menu, Bell, LogOut,
  Upload, FileText, Award, GraduationCap, BookOpen, Users, Calendar,
  Clock, Home, Mail, Phone, MapPin, CreditCard,
  ArrowUp, ArrowDown, Link, MoreHorizontal, Wrench, KeyRound
} from 'lucide-react';

const iconMap = {
  add: Plus, edit: Edit2, delete: Trash2, view: Eye, search: Search,
  filter: Filter, save: Save, download: Download, print: Save,
  left: ChevronLeft, right: ChevronRight, up: ChevronUp, down: ChevronDown,
  menu: Menu, settings: Settings, user: User, lock: Lock,
  back: ArrowLeft, forward: ArrowRight, close: X, check: Check,
  bell: Bell, logout: LogOut, upload: Upload,
  file: FileText, award: Award, graduation: GraduationCap, book: BookOpen,
  users: Users, calendar: Calendar, clock: Clock, home: Home,
  mail: Mail, phone: Phone, location: MapPin, payment: CreditCard,
  arrow_up: ArrowUp, arrow_down: ArrowDown, external: Link,
  more_v: MoreHorizontal, more_h: MoreHorizontal, wrench: Wrench, key: KeyRound,
};

const getIcon = (iconName) => {
  if (!iconName) return null;
  if (React.isValidElement(iconName)) return iconName;
  const Icon = iconMap[iconName] || iconMap.wrench;
  return <Icon className="w-4 h-4" />;
};

const variants = {
  primary: 'bg-primary hover:bg-primary/90 text-white shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
  ghost: 'hover:bg-slate-100 text-slate-600',
  outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
  accent: 'bg-accent hover:bg-accent/90 text-primary font-semibold shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && getIcon(icon)}
      {children}
      {iconRight && getIcon(iconRight)}
    </button>
  );
};

export default Button;
