import React from 'react';
import { Landmark, FileText, Cog, BadgeCheck } from 'lucide-react';

const iconMap = {
  account_balance: Landmark,
  policy: FileText,
  precision_manufacturing: Cog,
  badge: BadgeCheck,
};

const affiliations = [
  { icon: 'account_balance', label: 'Govt. Registered', sub: 'Ministry of Corporate Affairs', color: 'text-primary bg-blue-50' },
  { icon: 'policy', label: 'Niti Aayog', sub: 'Registered NGO', color: 'text-emerald-600 bg-emerald-50' },
  { icon: 'precision_manufacturing', label: 'MSME Affiliated', sub: 'Govt of India', color: 'text-orange-600 bg-orange-50' },
  { icon: 'badge', label: 'ISO 9001:2015', sub: 'Quality Management', color: 'text-purple-600 bg-purple-50' },
];

const SecretaryAffiliations = () => {
  return (
    <section className="bg-white py-16 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-black uppercase tracking-[0.25em] text-slate-400 mb-12">
          Trusted &amp; Accredited By
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {affiliations.map((a, i) => (
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

export default SecretaryAffiliations;
