import React from 'react';
import { submitContactForm } from '../../api/contact';
import { publicCourses } from '../../constants/publicCourses';

const ContactSection = () => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    phone: '',
    course: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitContactForm({
      source: 'Homepage',
      ...formData,
    });
  };

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
            <a href="mailto:info@ansdb.org" className="bg-secondary text-white px-5 py-3 rounded-lg hover:scale-105 transition shadow-md font-bold text-sm">
              Email Support
            </a>
          </div>
          <div className="h-64 rounded-lg overflow-hidden shadow-lg border-2 border-slate-100">
            <iframe
              src="https://www.google.com/maps?q=Natunpukur%2C%202nd%20Rabindra%20Sarani%20Lane%2C%20Bolpur%2C%20West%20Bengal%2C%20731204&output=embed"
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
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your name"
                type="text"
                value={formData.fullName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                name="phone"
                onChange={handleChange}
                placeholder="Enter phone number"
                type="tel"
                value={formData.phone}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Interested Course</label>
              <select
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                name="course"
                onChange={handleChange}
                value={formData.course}
              >
                <option value="">Select a Course</option>
                {publicCourses.map((course) => (
                  <option key={course.id} value={course.title}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Your Message</label>
              <textarea
                className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                name="message"
                onChange={handleChange}
                placeholder="How can we help you?"
                rows="4"
                value={formData.message}
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
