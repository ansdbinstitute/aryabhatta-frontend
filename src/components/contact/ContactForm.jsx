import React from 'react';

const ContactForm = () => {
  return (
    <div className="bg-[#F8FAFF] p-8 md:p-10 rounded-[2rem] shadow-inner border border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-accent rounded-full"></div>
        <h3 className="text-primary text-2xl font-black tracking-tight">Quick Enquiry Form</h3>
      </div>
      
      <form 
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Your message has been received! We will get back to you within 24 hours.");
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
            <input 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold" 
              placeholder="Your Name" 
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
            <input 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold" 
              placeholder="+91 00000 00000" 
              type="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Interested Course</label>
          <select className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold appearance-none cursor-pointer">
            <option>Select a course</option>
            <option>Paramedical & Nursing</option>
            <option>Professional Management</option>
            <option>Advanced IT & Tech</option>
            <option>Vocational Skills</option>
            <option>Early Childhood Education</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">How can we help?</label>
          <textarea 
            className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold min-h-[120px]" 
            placeholder="Tell us about your requirements..."
            rows="4"
          ></textarea>
        </div>

        <button 
          className="w-full bg-primary hover:bg-secondary text-white py-5 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-300 transform hover:scale-105 shadow-xl shadow-primary/30"
          type="submit"
        >
          Send Message
        </button>
      </form>
      
      <p className="text-center text-slate-600 text-xs mt-6 leading-relaxed">
        By submitting this form, you agree to our <span className="text-accent underline cursor-pointer font-semibold">Privacy Policy</span>. <br/>
        We will get back to you within 24 hours.
      </p>
    </div>
  );
};

export default ContactForm;
