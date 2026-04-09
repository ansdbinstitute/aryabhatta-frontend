import React from 'react';
import { Briefcase } from 'lucide-react';

const PlacementHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Career & Placement Services
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to
            <span className="block text-secondary-light">Professional Success</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10">
            We bridge the gap between talent and opportunity. Our strong industry partnerships 
            and dedicated placement support ensure our students kickstart their careers with confidence.
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background-light to-transparent" />
    </section>
  );
};

export default PlacementHero;
