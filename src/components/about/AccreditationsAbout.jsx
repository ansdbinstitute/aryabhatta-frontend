import React from 'react';
import { Landmark, BadgeCheck, Building, Scale, Shield } from 'lucide-react';

const iconMap = {
  account_balance: Landmark,
  verified: BadgeCheck,
  domain: Building,
  gavel: Scale,
  security: Shield,
};

const accreditations = [
  { icon: 'account_balance', label: 'Govt Registered', sub: 'Ministry of Corporate Affairs', color: 'text-primary bg-blue-50' },
  { icon: 'verified', label: 'MCA Registered', sub: 'Section 8 Foundation', color: 'text-emerald-600 bg-emerald-50' },
  { icon: 'domain', label: 'MSME Certified', sub: 'Govt of India', color: 'text-orange-600 bg-orange-50' },
  { icon: 'gavel', label: 'ISO 9001:2015', sub: 'Quality Management', color: 'text-purple-600 bg-purple-50' },
  { icon: 'security', label: 'Skill India', sub: 'NSDC Partner', color: 'text-accent bg-amber-50' },
];

const AccreditationsAbout = () => {
  return (
    <section className="bg-white py-16 md:py-24 px-6 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-slate-400 font-black uppercase tracking-[0.25em] text-xs mb-12">
          Our Accreditations &amp; Partnerships
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {accreditations.map((a, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 hover:border-accent/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default bg-white"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.color} group-hover:scale-110 transition-transform`}>
                {React.createElement(iconMap[a.icon], { className: 'w-7 h-7' })}
              </div>
              <div className="text-center">
                <p className="font-black text-slate-800 text-sm leading-tight">{a.label}</p>
                <p className="text-slate-400 text-[10px] mt-1 font-medium">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditationsAbout;
