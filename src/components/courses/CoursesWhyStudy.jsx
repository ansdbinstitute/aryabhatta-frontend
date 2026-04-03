import React from 'react';
import { Wrench, BadgeCheck, Briefcase, Users } from 'lucide-react';

const iconMap = {
  handyman: Wrench,
  verified: BadgeCheck,
  work_history: Briefcase,
  groups: Users,
};

const features = [
  { icon: 'handyman', title: 'Hands-on Training', desc: '80% practical sessions in fully equipped modern laboratories.' },
  { icon: 'verified', title: 'Govt. Certification', desc: 'Certificates recognized nationally for govt. and private job applications.' },
  { icon: 'work_history', title: 'Job Placement', desc: 'Dedicated placement cell with 95% track record in top industries.' },
  { icon: 'groups', title: 'Expert Faculty', desc: 'Instructors with minimum 10+ years of industrial field experience.' },
];

const CoursesWhyStudy = () => {
  return (
    <section className="py-20 px-6 lg:px-20 border-y border-slate-200" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-danger font-black tracking-[0.25em] uppercase text-xs border-b-2 border-danger/40 pb-1 inline-block mb-4">Our Advantage</span>
        <h2 className="text-primary text-4xl font-black mb-3 mt-3">Why Study at ANSDB?</h2>
        <div className="h-1.5 w-24 bg-accent mx-auto mb-16 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group flex flex-col items-center p-6 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100 hover:border-accent/30">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20 group-hover:bg-accent transition-all duration-300">
                {React.createElement(iconMap[f.icon], { className: 'w-8 h-8 text-accent group-hover:text-primary transition-colors' })}
              </div>
              <h4 className="text-primary font-bold text-lg mb-2">{f.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesWhyStudy;

