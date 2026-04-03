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
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                WELCOME BACK, <span className="text-blue-600 uppercase">{user?.firstName || 'STUDENT'}</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Portal Activity • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 px-1.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs lg:text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
                {user?.firstName?.[0] || 'S'}
              </div>
              <div className="hidden sm:block pr-2">
                <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user?.roleType || 'Student'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default StudentLayout;
