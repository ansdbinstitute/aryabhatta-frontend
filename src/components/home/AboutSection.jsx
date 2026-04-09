import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl order-2 md:order-1">
          <img
            alt="Aryabhatta National Skill Development Board training environment in Bolpur"
            className="w-full h-64 md:h-80 lg:h-96 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaZWRDZQHWZKj6U0a92WBbyS1aI0aS8fonhUCSCy8-2hJBjf1ltR8r4nEFFHa8GnIYWqrBbdxZn-8wgplagvzIQJ5i0_diusBAxKQPTPNQyS_c80MQEBJoC-vtqdTnKtzKDc8HoBNsLHLbEaBik5Dc5giyyWMuNbhT3fKHN9WHduv4svDuM0e9iHYSjVVro7khaGxbMxpzpk5iHbfqEzuLPqen0qJjl-9Ok8IG8m_JuXhibbtVmzH2y3VtvTsFoOUE2VwDGId6U_I"
          />
        </div>

        {/* Content */}
        <div className="space-y-4 md:space-y-6 order-1 md:order-2">
          <span className="text-accent font-bold tracking-widest text-xs uppercase">About ANSDB</span>
          <h2 className="text-primary text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-tight">
            Leading the Way in Technical Vocational Training
          </h2>
          <div className="space-y-3 md:space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>
              Aryabhatta National Skill Development Board (ANSDB) is a premier unit of the <span className="font-bold text-primary">Jevaankaushal Foundation</span>, a non-profit organization registered under Ministry of Corporate Affairs Govt. of India. We are dedicated to empowering the youth of India by providing world-class <Link to="/courses" className="text-primary font-semibold hover:text-secondary">skill training</Link> that transforms traditional academic learning into practical, job-ready expertise.
            </p>
            <p>
              With training centers across the country, ANSDB is growing as a trusted <Link to="/" className="text-primary font-semibold hover:text-secondary">best institute in Bolpur</Link> for students seeking quality <Link to="/courses" className="text-primary font-semibold hover:text-secondary">vocational training in Bolpur</Link> and <Link to="/courses" className="text-primary font-semibold hover:text-secondary">computer centre in Bolpur</Link>.
            </p>
          </div>
          <Link to="/about">
            <button className="bg-primary hover:bg-secondary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-all mt-2 hover:scale-105 text-sm md:text-base">
              Know More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
