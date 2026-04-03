import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const GalleryHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <h1 className="text-accent text-4xl md:text-6xl font-black mb-6">Institute Gallery</h1>
        <nav className="flex justify-center items-center gap-2 text-[#EEF4FF]/80 text-sm md:text-base font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Gallery</span>
        </nav>
      </div>
    </section>
  );
};

export default GalleryHero;
