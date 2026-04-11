import React from 'react';
import { Link } from 'react-router-dom';

const SecretaryMessage = () => {
  return (
    <section className="py-20 px-4 md:px-10" style={{ backgroundColor: '#FFFDF0' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Image */}
        <div className="w-full md:w-1/3">
          <div className="relative">
            <img
              alt="Secretary ANSDB"
              className="rounded-lg shadow-2xl w-full"
              src="/images/secretary.png"
            />
            <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-lg shadow-xl">
              <h4 className="font-bold text-primary">A. Ghosh</h4>
              <p className="text-[10px] uppercase font-bold text-white tracking-widest leading-tight mt-1">Secretary, Aryabhatta National Skill Development Board (ANSDB)</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="w-full md:w-2/3 space-y-6 mt-8 md:mt-0">
          <span className="text-accent text-5xl font-display italic">"</span>
          <blockquote className="text-2xl font-display italic text-primary leading-snug">
            "Skill development is the most powerful tool for individual growth and national prosperity."
          </blockquote>
          <p className="text-slate-600 leading-relaxed">
            Our institution is committed to creating a pathway for students to achieve their dreams. By focusing on practical, hands-on training, we ensure that every graduate from Aryabhatta National Skill Development Board (ANSDB) is ready for the real-world challenges of the industrial workforce.
          </p>
          <Link to="/secretary">
            <button className="border-2 border-accent text-primary px-8 py-3 rounded-lg font-bold hover:bg-accent transition-all hover:scale-105">
              Read Full Message
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SecretaryMessage;
