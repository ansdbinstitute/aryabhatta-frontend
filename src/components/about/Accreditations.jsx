import React from 'react';
import { Landmark, BadgeCheck, Building, Scale, Shield } from 'lucide-react';

const iconMap = {
  account_balance: Landmark,
  verified: BadgeCheck,
  domain: Building,
  gavel: Scale,
  security: Shield,
};

const Accreditations = () => {
    const items = [
        { icon: 'account_balance', label: 'Govt Registered' },
        { icon: 'verified', label: 'MCA Registered' },
        { icon: 'domain', label: 'MSME Certified' },
        { icon: 'gavel', label: 'ISO 9001:2015' },
        { icon: 'security', label: 'Skill India' },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 py-12 px-6 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto">
                <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
                    Our Accreditations & Partnerships
                </p>
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                                {React.createElement(iconMap[item.icon], { className: 'w-8 h-8' })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Accreditations;
