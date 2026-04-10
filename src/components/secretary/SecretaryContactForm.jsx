import React, { useState } from 'react';
import { submitContactForm } from '../../api/contact';

const SecretaryContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitContactForm({
      source: 'Secretary Desk',
      recipient: 'director@ansdb.org',
      ...formData
    });
  };

  return (
    <section className="py-24 md:py-28" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl bg-white p-10 shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <span className="text-danger font-black tracking-[0.25em] text-xs uppercase border-b-2 border-danger/40 pb-1 inline-block mb-4">Get In Touch</span>
            <h2 className="font-display text-3xl font-bold text-primary mt-3">Contact the Secretary's Office</h2>
            <p className="mt-2 text-slate-500">Direct inquiries regarding institutional partnerships or policy matters.</p>
          </div>
          <form 
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-primary mb-2">Your Name</label>
              <input 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" 
                placeholder="Your full name" 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-primary mb-2">Email Address</label>
              <input 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" 
                placeholder="you@example.com" 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-primary mb-2">Subject</label>
              <input 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" 
                placeholder="Inquiry regarding skill development programs" 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-primary mb-2">Message</label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-none" 
                placeholder="How can we help you?" 
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="col-span-1 md:col-span-2">
              <button 
                className="w-full rounded-xl bg-accent py-4 text-sm font-bold text-primary shadow-lg transition-all hover:brightness-105 hover:scale-105 active:scale-[0.98]" 
                type="submit"
              >
                Send Message to Secretary's Office
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

  );
};

export default SecretaryContactForm;

