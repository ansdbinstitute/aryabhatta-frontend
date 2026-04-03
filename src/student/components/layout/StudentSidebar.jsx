import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  CreditCard, 
  UserCircle, 
  Bell, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';
import useStudentAuthStore from '../../stores/studentAuthStore';
import { classNames, getFullName, getInitials, getMediaUrl } from '../../../erp/utils/helpers';

const StudentSidebar = ({ isOpen, onClose }) => {
  const user = useStudentAuthStore((s) => s.user);
  const logout = useStudentAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const fullName = getFullName(user?.firstName, user?.lastName);
  const initials = getInitials(user?.firstName, user?.lastName);
  const profileImageUrl = getMediaUrl(user?.profileImage);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'Study Materials', icon: BookOpen, path: '/student/materials' },
    { label: 'Exams', icon: Bell, path: '/student/exams' },
    { label: 'Results', icon: Award, path: '/student/results' },
    { label: 'Certificates', icon: ShieldCheck, path: '/student/certificates' },
    { label: 'ID Cards', icon: Fingerprint, path: '/student/id-card' },
    { label: 'Payments', icon: CreditCard, path: '/student/payments' },
    { label: 'My Profile', icon: UserCircle, path: '/student/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <aside
      className={classNames(
        'fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 transform transition-transform duration-300 ease-in-out border-r border-slate-800 lg:static lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight leading-tight">ANSDB</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                classNames(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'hover:bg-white/5 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className={classNames('w-5 h-5 transition-colors', 'group-hover:text-white')} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black text-white overflow-hidden border border-slate-600 shadow-sm">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1E293B] rounded-full shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-wide">{fullName}</p>
              <p className="text-[10px] font-bold text-slate-500 truncate leading-none mt-0.5">{user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
