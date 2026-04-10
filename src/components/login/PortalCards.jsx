import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Building, Shield } from 'lucide-react';

const PortalCards = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#F8FAFF]">
      {/* Background Accents */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(#1248BB 1px, transparent 1px), radial-gradient(#1248BB 1px, #F8FAFF 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      ></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Page Heading */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-display text-4xl lg:text-5xl text-primary font-bold">Select Your Portal</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Choose your destination to access personalized tools and services tailored for your role within the Aryabhatta National Skill Development Board.
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-6"></div>
        </div>

        {/* Login Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Login Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Student Login</h3>
            <p className="text-slate-600 mb-8 flex-grow">
              Access your personalized dashboard, attendance records, digital study materials, and examination results.
            </p>
            <Link
              to="/student/login"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              Enter Student Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Institute Login Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
              <Building className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Institute Login</h3>
            <p className="text-slate-600 mb-8 flex-grow">
              Management portal for affiliated training centers, partner institutes, and skill development providers.
            </p>
            <Link
              to="/erp/login?portal=institute"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              Enter Institute Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Login Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Shield className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Administration Login</h3>
            <p className="text-slate-600 mb-8 flex-grow">
              Secure access gateway for board officials, regional coordinators, and system administrators.
            </p>
            <Link
              to="/erp/login?portal=administration"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              Enter Admin Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalCards;
