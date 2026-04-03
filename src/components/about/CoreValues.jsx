import React from 'react';
import { Shield, Award, Users, Lightbulb } from 'lucide-react';

const iconMap = {
  verified_user: Shield,
  workspace_premium: Award,
  groups: Users,
  lightbulb: Lightbulb,
};

const values = [
  { icon: 'verified_user', label: 'Integrity', desc: 'Ethical standards in every program.', color: 'bg-blue-50 text-primary' },
  { icon: 'workspace_premium', label: 'Excellence', desc: 'Quality education without compromise.', color: 'bg-amber-50 text-amber-600' },
  { icon: 'groups', label: 'Empowerment', desc: 'Enabling career transformation.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'lightbulb', label: 'Innovation', desc: 'Modern tools for modern learning.', color: 'bg-purple-50 text-purple-600' },
];

const CoreValues = () => {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-danger font-black tracking-[0.25em] uppercase text-xs pb-1 border-b-2 border-danger/40 mb-4 inline-block">Foundations</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-4">Our Core Values</h2>
          <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="group p-8 bg-white rounded-3xl text-center shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-accent/30 hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 ${v.color}`}>
                {React.createElement(iconMap[v.icon], { className: 'w-7 h-7' })}
              </div>
              <h4 className="font-black text-primary text-lg mb-2">{v.label}</h4>
              <p className="text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;

