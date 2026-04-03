import React from 'react';
import { Award, ArrowDown } from 'lucide-react';

const CoursesHero = () => {
  return (
    <section
      className="relative px-6 lg:px-20 flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A192F 0%, #002366 50%, #0A192F 100%)', minHeight: '640px', paddingTop: '5rem', paddingBottom: '5rem' }}
    >
      {/* Gold glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-[120px] rounded-full -mr-20"></div>
      <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 w-full">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-6">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-accent text-xs font-bold uppercase tracking-widest">Govt. Certified Training</span>
          </div>
          <h1 className="text-white text-4xl lg:text-6xl font-black leading-tight mb-6 font-display">
            Our Professional <span className="text-accent">Skill Development</span> Courses
          </h1>
          <p className="text-slate-300 text-lg lg:text-xl max-w-2xl mb-8 leading-relaxed">
            Empowering your future with industry-leading, career-oriented training and hands-on skill development designed for the modern job market.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button 
              className="bg-danger text-white px-8 py-4 rounded-xl font-extrabold flex items-center gap-2 hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-danger/20"
              onClick={() => window.scrollBy({top: window.innerHeight * 0.8, behavior: 'smooth'})}
            >
              Explore Courses <ArrowDown className="w-4 h-4" />
            </button>
            <button 
              className="border-2 border-accent text-accent hover:bg-accent hover:text-primary px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              onClick={() => alert("The comprehensive course schedule is currently being finalized. Please check back later.")}
            >
              View Schedule
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 blur-xl rounded-full"></div>
            <img
              className="relative rounded-2xl border-4 border-accent/30 shadow-2xl object-cover w-full h-[400px]"
              alt="Technical professional working with specialized equipment"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArZSxXDIHt5HlUzYhBMYDwMzWH7hViMQw3i0eaMq58Bx95heCjRogihTTgHn7S_ZoNh3Fa6pDH3yS9SMGheDNUXAwhvHLdpPIdkuCl_2aV69rh3VuESf-5WHQd7KBIUcKNYff6Pg_RIvupQZZU5J6mgk2RLo9pYpCo2Eiypz1BAusKs-dCq0w_WfnGcpkO7lwGmM_xRAD3Ml_3vHZX6zWX4wX1pKgm0bc6mkxcxCXEy-09NGRg06bgmzz0ufQfmWIuFUB73SOSlZE"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesHero;

