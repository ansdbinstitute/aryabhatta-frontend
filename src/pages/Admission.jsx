import React from 'react';
import ContactSection from '../components/home/ContactSection';
import WhyChoose from '../components/home/WhyChoose';

const Admission = () => {
  return (
    <div>
      <section className="bg-ansdb-navy py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-heading font-bold">Admission Open 2026</h1>
      </section>
      <section className="py-20 px-4 md:px-10 bg-ansdb-sky/30">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-eight shadow-xl border border-ansdb-gold/20">
          <h2 className="text-3xl font-heading font-bold text-ansdb-navy mb-6">How to Apply?</h2>
          <div className="space-y-6 text-slate-600">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-ansdb-gold text-ansdb-navy flex items-center justify-center font-bold shrink-0">1</div>
              <p>Download the admission form or apply online via the quick enquiry form below.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-ansdb-gold text-ansdb-navy flex items-center justify-center font-bold shrink-0">2</div>
              <p>Visit our campus with required documents (Aadhar, Educational certificates, Photographs).</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-ansdb-gold text-ansdb-navy flex items-center justify-center font-bold shrink-0">3</div>
              <p>Pay the registration fee and start your journey towards skill excellence.</p>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
      <WhyChoose />
    </div>
  );
};

export default Admission;
