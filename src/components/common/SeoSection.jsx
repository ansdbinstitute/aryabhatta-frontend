import React from 'react';

const SeoSection = ({ id, eyebrow, title, children }) => {
  return (
    <section id={id} className="py-16 px-4 md:px-10 bg-white border-t border-slate-100 scroll-mt-28">
      <div className="max-w-5xl mx-auto">
        {eyebrow ? (
          <p className="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4">{eyebrow}</p>
        ) : null}
        <h2 className="text-primary text-3xl md:text-4xl font-display font-bold mb-6">{title}</h2>
        <div className="space-y-5 text-slate-700 leading-8 text-base md:text-lg">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SeoSection;
