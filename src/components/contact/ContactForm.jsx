import React from 'react';
import { submitContactForm } from '../../api/contact';
import { publicCourses } from '../../constants/publicCourses';

const ContactForm = () => {
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
      source: 'Contact Page',
      ...formData,
    });
  };

  return (
    <div className="bg-[#F8FAFF] p-8 md:p-10 rounded-[2rem] shadow-inner border border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-accent rounded-full"></div>
        <h3 className="text-primary text-2xl font-black tracking-tight">Quick Enquiry Form</h3>
      </div>
      
      <form 
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
            <input 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold" 
              name="fullName"
              onChange={handleChange}
              placeholder="Your Name" 
              type="text"
              value={formData.fullName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
            <input 
              className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold" 
              name="phone"
              onChange={handleChange}
              placeholder="+91 00000 00000" 
              type="tel"
              value={formData.phone}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Interested Course</label>
          <select
            className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold appearance-none cursor-pointer"
            name="course"
            onChange={handleChange}
            value={formData.course}
          >
            <option value="">Select a course</option>
            {publicCourses.map((course) => (
              <option key={course.id} value={course.title}>{course.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">How can we help?</label>
          <textarea 
            className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 focus:border-accent focus:ring-0 outline-none transition-all text-slate-700 font-semibold min-h-[120px]" 
            name="message"
            onChange={handleChange}
            placeholder="Tell us about your requirements..."
            rows="4"
            value={formData.message}
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
