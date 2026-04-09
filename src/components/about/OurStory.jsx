import React from 'react';
import { Link } from 'react-router-dom';

const OurStory = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Image Left + Text Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Image Section - Left */}
          <div className="lg:col-span-5 relative group">
            <div className="relative">
              {/* Decorative blobs behind image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/15 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              
              {/* Image container with layered borders */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-primary/10 group-hover:ring-accent/20 transition-all duration-300">
                <img
                  alt="Professional classroom and vocational training session at ANSDB Bolpur"
                  className="w-full h-[380px] md:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                  src="/images/gallery/IMG_4779.jpg"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Corner badge */}
              <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-primary/10">
                <span className="text-primary font-bold text-sm">Est. 2026</span>
              </div>
            </div>
          </div>

          {/* Text Section - Right of Image */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block text-accent font-black tracking-[0.25em] text-xs uppercase border-b-2 border-accent/50 pb-1">Our Journey</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Bridging the Gap Between <span className="text-secondary">Education</span> & Employability
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-accent to-secondary rounded-full"></div>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                Aryabhatta National Skill Development Board (ANSDB) is a premier unit of the <span className="font-bold text-primary">Jevaankaushal Foundation</span>, a non-profit organization registered under Ministry of Corporate Affairs Govt. of India. Since our inception, we have been dedicated to empowering the youth of India by providing world-class skill training that aligns with the ever-evolving needs of the global industry. Our curriculum is designed to transform traditional academic learning into practical, job-ready expertise. We operate through a vast network of training centers across the country, ensuring that quality technical education is accessible to everyone, from metropolitan cities to the most remote villages.
              </p>
              <p>
                Aryabhatta National Skill Development Board (ANSDB) is a premier unit of the <span className="font-bold text-primary">Jibankushal Foundation</span>, created to strengthen practical learning and career-focused education for students who want real employability, not just classroom theory. For learners in <Link to="/contact" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">Bolpur</Link> and nearby areas, ANSDB is growing as a trusted destination where education is connected directly with technical skill, confidence, and future opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Text continues below (full width) */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                Our journey is guided by one clear idea: bridging the gap between education and employability through structured, hands-on training. That is why students exploring ANSDB often discover more than an institute name. They find a learning environment designed around practical instruction, career relevance, and support for students who are searching for a dependable <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">skill development institute in Bolpur</Link>, <Link to="/courses" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">vocational training in Bolpur</Link>, or a <Link to="/courses" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">computer centre in Bolpur</Link> that takes professional growth seriously.
              </p>
              <p>
                What makes ANSDB stand out is the balance between local accessibility and industry-oriented learning. We continue to build our reputation as one of the <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">best institutes in Bolpur</Link> by helping students move naturally from interest to action, whether they begin by exploring <Link to="/courses" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">courses</Link>, understanding our <Link to="/about" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">mission</Link>, or reaching out for <Link to="/contact" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">guidance</Link>. The goal is simple and long-term: to make ANSDB a reliable, career-focused training choice for students who want practical education with direction, credibility, and local relevance.
              </p>
              <p className="pt-2">
                Whether you're searching for <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">ANSDB</Link>, <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">Aryabhatta National Skill Development Board</Link>, the <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">best institute at Bolpur</Link>, or the <Link to="/" className="text-primary font-semibold hover:text-secondary border-b border-primary/30 hover:border-secondary transition-colors">best skill development institute</Link>, ANSDB stands as your premier destination for quality vocational and technical education in the region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;