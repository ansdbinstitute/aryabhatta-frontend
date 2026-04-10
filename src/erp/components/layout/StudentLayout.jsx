import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { getStudentNavConfig } from '../../utils/permissions';
import { getInitials, getFullName, classNames, getMediaUrl } from '../../utils/helpers';
import Toast from '../ui/Toast';
import { LayoutDashboard, ClipboardList, Building, Award, FolderOpen, Calendar, Bell, Menu, LogOut } from 'lucide-react';

const StudentLayout = ({
  basePath = '/erp',
  loginPath = '/erp/login',
}) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const navItems = getStudentNavConfig(basePath);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const fullName = getFullName(user?.firstName, user?.lastName);
  const initials = getInitials(user?.firstName, user?.lastName);
  const profileImageUrl = getMediaUrl(user?.profileImage);

  const handleLogout = () => {
    logout();
    navigate(loginPath);
  };

  return (
    <div className="min-h-screen bg-erp-bg font-erp">
      {/* Top Navigation */}
      <header className="bg-white border-b border-erp-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="ANSDB Logo"
                className="h-10 w-10 rounded-lg bg-white object-contain p-1 shadow-sm"
              />
              <span className="font-bold text-primary text-lg hidden sm:block">ANSDB</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-primary/5 text-primary font-semibold'
                        : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-erp-border bg-white shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm',
                      isActive
                        ? 'bg-primary/5 text-primary font-semibold'
                        : 'text-slate-500'
                    )
                  }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
};

export default StudentLayout;
