import React from 'react';
import { Link } from 'react-router-dom';

const EnrollCTA = () => {
  return (
    <section className="py-16 px-4 text-center" style={{ backgroundImage: 'linear-gradient(to right, #0A192F 0%, #082B76 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-white text-3xl md:text-5xl font-display font-bold">
          Ready to Start Your Skill Journey?
        </h2>
        <p className="text-blue-100 text-lg">
          Limited seats available for the upcoming session. Enroll today to secure your future.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact">
            <button className="bg-danger hover:bg-red-700 text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest transition-all shadow-2xl hover:scale-105">
              Enroll Now
            </button>
          </Link>
          <a href="tel:+919046442337">
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-primary px-10 py-4 rounded-lg font-bold transition">
              Call Us Now
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default EnrollCTA;
