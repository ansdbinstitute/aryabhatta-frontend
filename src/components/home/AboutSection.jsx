import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <img
            alt="About ANSDB"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaZWRDZQHWZKj6U0a92WBbyS1aI0aS8fonhUCSCy8-2hJBjf1ltR8r4nEFFHa8GnIYWqrBbdxZn-8wgplagvzIQJ5i0_diusBAxKQPTPNQyS_c80MQEBJoC-vtqdTnKtzKDc8HoBNsLHLbEaBik5Dc5giyyWMuNbhT3fKHN9WHduv4svDuM0e9iHYSjVVro7khaGxbMxpzpk5iHbfqEzuLPqen0qJjl-9Ok8IG8m_JuXhibbtVmzH2y3VtvTsFoOUE2VwDGId6U_I"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <span className="text-accent font-bold tracking-widest text-xs uppercase">About ANSDB</span>
          <h2 className="text-primary text-4xl font-display font-bold leading-tight">
            Leading the Way in Technical Vocational Training
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Aryabhatta National Skill Development Board (ANSDB) is a premier unit of
            Jibankushal Foundation, registered under the Ministry of Corporate Affairs
            (Section 8), Government of India. We are dedicated to bridge the gap
            between education and employability.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our mission is to empower the youth from rural and urban sectors by
            providing high-quality skill development programs aligned with the National
            Skill Qualification Framework (NSQF).
          </p>
          <Link to="/contact">
            <button className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-semibold transition-all mt-2 hover:scale-105">
              Know More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
