import React from 'react';

const SecretaryDeskHero = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-28" style={{ background: 'linear-gradient(135deg, #faf7f2 0%, #f5f0e8 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
        <span className="inline-block text-accent font-black tracking-[0.25em] text-xs uppercase border-b-2 border-accent/40 pb-1 mb-6">Secretary's Office</span>
        <h1 className="text-4xl font-black tracking-tight text-primary sm:text-6xl leading-tight">
          Message from the <span className="text-accent">Secretary</span>
        </h1>
        <div className="w-20 h-1.5 bg-accent mx-auto my-6 rounded-full"></div>
        <p className="text-lg font-medium text-slate-600 max-w-2xl mx-auto">
          Shaping the Future of Skill Development in India through innovative vocational training and institutional excellence.
        </p>
      </div>
    </section>
  );
};

export default SecretaryDeskHero;

