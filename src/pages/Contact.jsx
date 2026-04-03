import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactMap from '../components/contact/ContactMap';
import ContactDetails from '../components/contact/ContactDetails';
import ContactForm from '../components/contact/ContactForm';

const Contact = () => {
  return (
    <div className="bg-slate-50 dark:bg-background-dark min-h-screen">
      <ContactHero />
      
      <section className="max-w-7xl mx-auto py-16 px-6 lg:px-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Left Column: Map */}
          <div className="h-[500px] lg:h-auto">
            <ContactMap />
          </div>
          
          {/* Right Column: Contact Details */}
          <div>
            <ContactDetails />
          </div>
        </div>

        {/* Full Width Enquiry Form Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;

