import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Globe } from 'lucide-react';

const iconMap = {
  location_on: MapPin,
  call: Phone,
  chat: MessageCircle,
  mail: Mail,
  language: Globe,
};

const ContactDetails = () => {
  const contactInfo = [
    { icon: 'location_on', color: 'text-royal bg-royal/10', label: 'Our Location', value: 'Natunpukur, 2nd Rabindra Sarani Lane, Bolpur, West Bengal, 731204' },
    { icon: 'call', color: 'text-primary bg-primary/10', label: 'Call Us', value: '+91 90464 42337' },
    { icon: 'chat', color: 'text-whatsapp bg-whatsapp/10', label: 'WhatsApp', value: '+91 90464 42337' },
    { icon: 'mail', color: 'text-danger bg-danger/10', label: 'Email Support', value: 'info@ansdb.org' },
    { icon: 'language', color: 'text-royal bg-royal/10', label: 'Website', value: 'www.ansdb.org' },
  ];

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
      <h3 className="text-accent font-black text-sm tracking-[0.25em] mb-3 uppercase">Get In Touch</h3>
      <h2 className="text-primary text-3xl md:text-4xl font-black mb-8 leading-tight">
        Aryabhatta National <br className="hidden md:block"/> Skill Development Board
      </h2>

      <div className="space-y-6 mb-10">
        {contactInfo.map((info, index) => (
          <div key={index} className="flex items-start gap-4 group">
            <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${info.color}`}>
              {React.createElement(iconMap[info.icon], { className: 'w-6 h-6' })}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">{info.label}</p>
              <p className="text-slate-700 font-bold group-hover:text-primary transition-colors">
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
        <a 
          href="https://wa.me/919046442337" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 px-4 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-green-500/20"
        >
          <MessageCircle className="w-5 h-5" /> WHATSAPP
        </a>
        <a 
          href="mailto:info@ansdb.org" 
          className="flex items-center justify-center gap-2 bg-danger text-white py-4 px-4 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-danger/20"
        >
          <Mail className="w-5 h-5" /> EMAIL
        </a>
      </div>
    </div>
  );
};

export default ContactDetails;
