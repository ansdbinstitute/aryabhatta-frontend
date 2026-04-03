import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const trustCards = [
    'ISO Certified',
    'MSME Certified',
    'MCA Registered',
    'Global Recognition',
  ];

  return (
    <section
      className="py-24 lg:py-40 px-4 md:px-10 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, #0A192F 0%, #082B76 100%)',
      }}
    >
      {/* Diagonal overlay pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px)',
        }}
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-[2]">
        {/* Text Content */}
        <div className="space-y-6">
          <span className="inline-block text-accent font-bold tracking-[0.2em] text-xs uppercase border-b-2 border-accent pb-1">
            Government Registered · ISO Certified
          </span>
          <h1 className="text-white text-4xl md:text-6xl font-display font-bold leading-tight">
            Empowering Youth Through Skill Development
          </h1>
          <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
            Join India's leading vocational training board. We provide industry-standard certifications and practical training for a brighter career.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/contact">
              <button className="bg-danger hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                Enroll Now
              </button>
            </Link>
            <Link to="/courses">
              <button className="border-2 border-accent text-accent hover:bg-accent hover:text-primary px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95">
                View Courses
              </button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-2 text-white text-sm">
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Certified Instructors</span>
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Government Recognized</span>
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">✓</span> Job Assistance</span>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center">
          <div className="w-full h-[400px] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPJsEEKrxw7f_iRyRnyoQdB1MbNAN-l51FGEk_sIjyA08G6jbfBuH77OjUxQr5dxBGXTWCyHqHqMRDZKwz4Ed0gfh_WYePZ0-RfTSEe6RLrm_QhP67LlE2rfuUp0t8GHHWt2L9niH3qveOdZ2VSDf1r2tas3s-UQrqa0Ndu_h_7vq7tf0fM-Xn0j4-eDsC6ZCs0WGpD0dXQWqEWUUqa6RSY40I94HCx5Vsa4hr4VBoJO6MZJmFpJ5FKAO1jccVdtuSJ9A0HabIaa8"
              alt="Student Training"
              className="rounded-xl shadow-2xl object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Trust Cards */}
      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 relative z-[2]">
        {trustCards.map((title, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-lg text-center border-t-4 border-accent hover:-translate-y-2 transition-all">
            <p className="text-primary font-bold text-sm">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
