import React from 'react';
import { Flag, Eye } from 'lucide-react';

const VisionMission = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20" style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #E8F0FF 100%)' }}>
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-danger font-black tracking-[0.25em] uppercase text-xs pb-1 border-b-2 border-danger/40 mb-4 inline-block">Our Purpose</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-4">What Drives Us</h2>
        <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="relative bg-primary p-12 md:p-14 min-h-[380px] flex flex-col justify-center rounded-3xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-b-8 border-accent overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="bg-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Flag className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-display text-3xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-white/80 leading-relaxed text-lg">
            To democratize skill-based education by providing accessible, affordable, and industry-standard training to every aspiring professional, fostering a generation of skilled manpower that drives national economic growth.
          </p>
        </div>

        {/* Vision Card */}
        <div className="relative bg-white p-12 md:p-14 min-h-[380px] flex flex-col justify-center rounded-3xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-b-8 border-primary overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-3xl font-bold text-primary mb-4">Our Vision</h3>
          <p className="text-slate-600 leading-relaxed text-lg">
            To be the leading national catalyst for skill excellence, creating a future where every Indian youth is equipped with the professional competency and confidence to succeed in the 21st-century global workspace.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;

