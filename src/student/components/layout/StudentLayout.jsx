import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { Menu, X, Bell, UserCircle } from 'lucide-react';
import useStudentAuthStore from '../../stores/studentAuthStore';
import Toast from '../../../erp/components/ui/Toast';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useStudentAuthStore((s) => s.user);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 md:w-6 h-5 md:h-6" />
            </button>
            <div className="hidden md:block">
              <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                Welcome back, <span className="text-blue-600 uppercase">{user?.firstName || 'Student'}</span>
              </h2>
              <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <Bell className="w-4 md:w-5 h-4 md:h-5" />
            </button>
            <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
              <div className="w-7 md:w-8 lg:w-9 h-7 md:h-8 lg:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm group-hover:scale-105 transition-transform">
                {user?.firstName?.[0] || 'S'}
              </div>
              <div className="hidden sm:block pr-1.5">
                <p className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-[8px] md:text-[9px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">{user?.roleType || 'Student'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default StudentLayout;
