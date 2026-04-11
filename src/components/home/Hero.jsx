import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/hero/hero-3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const trustCards = [
    'ISO Certified',
    'MSME Certified',
    'MCA Registered',
    'Global Recognition',
  ];

  return (
    <section
      className="py-16 md:py-24 lg:py-32 px-4 md:px-8 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, #0A192F 0%, #082B76 100%)',
      }}
    >
      {/* Background Image Slides */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`ANSDB training ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-60' : 'opacity-0'
            }`}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/30 to-[#082B76]/20" />
      </div>

      {/* Diagonal overlay pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px)',
        }}
      />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-[2]">
        {/* Text Content */}
        <div className="space-y-4 md:space-y-6">
          <span className="inline-block text-accent font-bold tracking-[0.2em] text-xs uppercase border-b-2 border-accent pb-1">
            Government Registered · ISO Certified
          </span>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
            Aryabhatta National Skill Development Board (ANSDB)
          </h1>
          <p className="text-accent text-lg md:text-xl font-bold tracking-wide">
            Empowering Youth Through Skill Development
          </p>
          <p className="text-blue-100 text-base md:text-lg max-w-lg leading-relaxed">
            Join India's leading vocational training board. We provide industry-standard certifications and practical training for a brighter career.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
            <Link to="/contact">
              <button className="bg-danger hover:bg-red-700 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
                Enroll Now
              </button>
            </Link>
            <Link to="/courses">
              <button className="border-2 border-accent text-accent hover:bg-accent hover:text-primary px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
                View Courses
              </button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 pt-2 text-white text-xs md:text-sm">
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Certified Instructors</span>
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Government Recognized</span>
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Job Assistance</span>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-accent w-6 h-2'
                : 'bg-white/50 w-2 h-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Trust Cards */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-[2]">
        {trustCards.map((title, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm p-3 md:p-6 rounded-lg shadow-lg text-center border-t-4 border-accent hover:-translate-y-2 transition-all">
            <p className="text-white font-bold text-xs md:text-sm">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;