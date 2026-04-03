import React from 'react';
import { Link } from 'react-router-dom';

const CoursesCTA = () => {
  return (
    <section className="py-16 px-6 lg:px-20 bg-white">
      <div
        className="max-w-7xl mx-auto rounded-[2rem] p-8 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #0A192F 0%, #002366 100%)' }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="cta-grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect fill="url(#cta-grid)" height="100%" width="100%"></rect>
          </svg>
        </div>
        {/* Gold glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center lg:text-left">
          <h2 className="text-white text-3xl lg:text-4xl font-black mb-4">Join the next batch!</h2>
          <p className="text-slate-300 text-lg">Admissions are now open for the upcoming session. Limited seats available per course.</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Link
            to="/contact"
            className="w-full sm:w-auto bg-danger text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-700 hover:scale-105 transition-all shadow-xl shadow-danger/30 text-center"
          >
            Inquire Now
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto border-2 border-accent text-accent hover:bg-accent hover:text-primary px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 text-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesCTA;

