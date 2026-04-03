import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const NoticeCTA = () => {
  return (
    <section className="bg-[#F8FAFF] py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-3xl p-10 lg:p-16 shadow-2xl border border-primary/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <Lock className="w-16 h-16 text-primary mb-6 relative z-10" />
          <h2 className="text-3xl lg:text-4xl font-display font-black text-primary mb-4 relative z-10">Looking for Student Specific Details?</h2>
          <p className="text-slate-600 text-lg mb-10 relative z-10 max-w-2xl mx-auto">
            Access your personalized dashboard to view exam results, personalized notifications, and internal course materials.
          </p>
          <Link 
            to="/login"
            className="bg-primary hover:bg-[#1248BB] text-white text-lg px-10 py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 mx-auto w-fit hover:scale-105 active:scale-95 relative z-10"
          >
            <User className="w-5 h-5" />
            Student Login Access
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NoticeCTA;
