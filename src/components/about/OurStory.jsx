import React from 'react';

const OurStory = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-accent/20">
            <img
              alt="Professional Classroom at ANSDB"
              className="w-full h-[440px] object-cover"
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
        <div className="space-y-6">
          <span className="inline-block text-danger font-black tracking-[0.2em] text-xs uppercase border-b-2 border-danger/40 pb-1">Our Journey</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary leading-tight">
            Bridging the Gap Between <span className="text-secondary">Education</span> & Employability
          </h2>
          <div className="w-16 h-1.5 bg-accent rounded-full"></div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              Aryabhatta National Skill Development Board (ANSDB) is a premier unit of the <span className="font-bold text-primary">Jibankushal Foundation</span>, an organization registered under Section 8 and proudly registered with <span className="font-bold text-primary">MCA</span>.
            </p>
            <p>
              Since our inception, we have been dedicated to empowering the youth of India by providing world-class skill training that aligns with the ever-evolving needs of the global industry.
            </p>
            <p>
              We operate through a vast network of training centers across the country, ensuring that quality technical education is accessible to everyone, from metropolitan cities to the most remote villages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

