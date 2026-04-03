import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import OurStory from '../components/about/OurStory';
import VisionMission from '../components/about/VisionMission';
import CoreValues from '../components/about/CoreValues';
import SecretaryLeadership from '../components/about/SecretaryLeadership';
import AccreditationsAbout from '../components/about/AccreditationsAbout';

const About = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-primary to-secondary py-12 md:py-16 px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">About ANSDB</h1>
          <nav className="flex justify-center items-center gap-2 text-white/80 text-sm md:text-base font-medium font-sans">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent font-semibold">About Us</span>
          </nav>
        </div>
      </section>

      {/* OUR STORY */}
      <OurStory />

      {/* VISION & MISSION */}
      <VisionMission />

      {/* CORE VALUES */}
      <CoreValues />

      {/* LEADERSHIP/SECRETARY */}
      <SecretaryLeadership />

      {/* ACCREDITATIONS */}
      <AccreditationsAbout />
    </div>
  );
};

export default About;
