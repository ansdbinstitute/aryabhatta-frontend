import React from 'react';
import { Link } from 'react-router-dom';

const GalleryCTA = () => {
  return (
    <section className="bg-[#EEF4FF] py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-primary text-3xl md:text-5xl font-bold mb-8">Ready to join our community?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact" className="w-full sm:w-auto bg-danger hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-105">
            Enroll Now
          </Link>
          <Link to="/contact" className="w-full sm:w-auto border-2 border-accent text-primary hover:bg-accent hover:text-white px-10 py-4 rounded-xl font-bold text-lg transition-all text-center hover:scale-105">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryCTA;
