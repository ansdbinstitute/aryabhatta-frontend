import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactMap from '../components/contact/ContactMap';
import ContactDetails from '../components/contact/ContactDetails';
import ContactForm from '../components/contact/ContactForm';
import Seo from '../components/common/Seo';

const Contact = () => {
  return (
    <div className="bg-slate-50 dark:bg-background-dark min-h-screen w-full overflow-x-hidden">
      <Seo
        title="Contact ANSDB Bolpur | Skill Development Institute in Bolpur"
        description="Contact ANSDB in Bolpur for course enquiries, admissions, and training details. Speak with a trusted skill development institute in Bolpur."
        path="/contact"
        keywords={[
          'ANSDB',
          'Aryabhatta National Skill Development Board',
          'skill development institute in Bolpur',
          'computer centre in Bolpur',
        ]}
      />
      <ContactHero />
      
      <section className="max-w-7xl mx-auto py-10 md:py-16 px-4 md:px-6 -mt-8 md:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
          {/* Left Column: Map */}
          <div className="h-[300px] md:h-[400px] lg:h-auto">
            <ContactMap />
          </div>
          
          {/* Right Column: Contact Details */}
          <div>
            <ContactDetails />
          </div>
        </div>

        {/* Full Width Enquiry Form Section */}
        <div className="mt-10 md:mt-16 max-w-4xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;
