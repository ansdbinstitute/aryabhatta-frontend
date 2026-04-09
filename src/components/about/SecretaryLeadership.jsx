import React from 'react';
import { Quote } from 'lucide-react';

const SecretaryLeadership = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #FFFBF2 0%, #FFF8E8 100%)' }}>
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-5 items-center gap-12 relative z-10">
        <div className="md:col-span-2 relative">
          <div className="absolute -inset-4 border-2 border-accent/40 rounded-full animate-pulse"></div>
          <div className="rounded-full w-64 h-64 md:w-80 md:h-80 mx-auto overflow-hidden border-8 border-white shadow-2xl ring-4 ring-accent/20">
            <img 
              alt="A. Ghosh — Secretary, ANSDB" 
              className="w-full h-full object-cover" 
              src="/images/secretary.png" 
              loading="lazy"
            />
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <Quote className="w-16 h-16 text-accent opacity-20" />
          <p className="font-display text-xl md:text-2xl italic text-primary leading-relaxed">
            "Skill development is the most powerful tool for national development. At ANSDB, we aren't just teaching courses; we are building careers and securing the future of our youth through dedication and innovation."
          </p>
          <div className="h-1.5 w-20 bg-accent rounded-full"></div>
          <div>
            <h4 className="text-2xl font-black text-primary">A. Ghosh</h4>
            <p className="text-danger font-bold uppercase tracking-widest text-sm">Secretary, ANSDB</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecretaryLeadership;

