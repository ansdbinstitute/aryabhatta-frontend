import React from 'react';

const ContactHero = () => {
  return (
    <section 
      className="py-16 px-6 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, #0A192F 0%, #082B76 100%)',
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px)',
          }}
        />
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
          Contact Us
        </h1>
        <div className="h-1.5 w-24 bg-accent mx-auto rounded-full shadow-lg shadow-accent/20"></div>
        <p className="text-blue-100/80 mt-6 max-w-2xl mx-auto text-lg">
          Have questions? We're here to help. Reach out to our team for any queries regarding admissions, courses, or partnerships.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
