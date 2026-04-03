import React from 'react';
import { Link } from 'react-router-dom';

const LoginCTA = () => {
  return (
    <section className="py-12 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(18,72,187,0.4)_0%,transparent_100%)] pointer-events-none"></div>
          
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Become an Affiliated Partner</h2>
            <p className="text-blue-100 max-w-xl text-lg">
              Join the Aryabhatta National Skill Development Board network and empower the next generation of professionals.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link to="/contact">
              <button className="w-full sm:w-auto bg-danger text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-danger/30 hover:scale-105 active:scale-95 text-center">
                Apply for Affiliation
              </button>
            </Link>
            <Link to="/about">
              <button className="w-full sm:w-auto border-2 border-accent text-accent hover:bg-accent hover:text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 text-center">
                View Requirements
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginCTA;
