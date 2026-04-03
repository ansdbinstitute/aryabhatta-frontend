import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-primary text-4xl font-display font-bold">Get In Touch</h2>
            <div className="w-20 h-1 bg-accent mt-4"></div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F5F8FF] rounded-lg flex items-center justify-center shrink-0 text-xl">📍</div>
              <div>
                <h4 className="font-bold text-primary">Our Institute</h4>
                <p className="text-slate-600 text-sm">Natunpukur, 2nd Rabindra Sarani Lane, Bolpur, West Bengal, 731204</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F5F8FF] rounded-lg flex items-center justify-center shrink-0 text-xl">📞</div>
              <div>
                <h4 className="font-bold text-primary">Phone / WhatsApp</h4>
                <p className="text-slate-600 text-sm">+91 90464 42337</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F5F8FF] rounded-lg flex items-center justify-center shrink-0 text-xl">✉️</div>
              <div>
                <h4 className="font-bold text-primary">Email Support</h4>
                <p className="text-slate-600 text-sm">info@ansdb.org</p>
              </div>
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <a href="https://wa.me/919046442337" className="bg-[#25D366] text-white px-5 py-3 rounded-lg hover:scale-105 transition shadow-md font-bold text-sm">
              WhatsApp Us
            </a>
            <a href="tel:+919046442337" className="bg-secondary text-white px-5 py-3 rounded-lg hover:scale-105 transition shadow-md font-bold text-sm">
              Call Support
            </a>
          </div>
          <div className="h-64 rounded-lg overflow-hidden shadow-lg border-2 border-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.8804918731557!2d88.34185737604313!3d22.620935530510656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89d9e4a30e8a7%3A0x6730248e36780c8e!2sBelur%20Math%2C%20Howrah%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              className="border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Quick Enquiry Form */}
        <div className="bg-[#F5F8FF] p-8 md:p-12 rounded-lg shadow-inner">
          <h3 className="text-2xl font-display font-bold text-primary mb-8">Quick Enquiry</h3>
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Your enquiry has been submitted successfully! Our team will contact you shortly.");
            }}
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                placeholder="Enter your name"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                placeholder="Enter phone number"
                type="tel"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Interested Course</label>
              <select className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                <option>Select a Course</option>
                <option>Mobile Repairing</option>
                <option>Web Development</option>
                <option>Junior Raw Madanic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Your Message</label>
              <textarea
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                placeholder="How can we help you?"
                rows="4"
              ></textarea>
            </div>
            <button
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-lg shadow-xl transition"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
