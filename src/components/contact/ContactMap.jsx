import React from 'react';
import { MapPin } from 'lucide-react';

const ContactMap = () => {
  return (
    <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white h-[400px] lg:h-full relative group">
      <iframe
        src="https://www.google.com/maps?q=Natunpukur%2C%202nd%20Rabindra%20Sarani%20Lane%2C%20Bolpur%2C%20West%20Bengal%2C%20731204&output=embed"
        width="100%"
        height="100%"
        className="border-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bolpur Branch Location"
      ></iframe>
      
      {/* Floating Badge */}
      <div className="absolute top-6 left-6 z-10 bg-white p-4 rounded-2xl shadow-xl border-b-4 border-accent flex items-center gap-4 transform transition-transform group-hover:scale-105">
        <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-danger" />
        </div>
        <div>
          <p className="font-black text-primary text-sm leading-tight">ANSDB Bolpur Branch</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Natunpukur, 2nd Rabindra Sarani Lane</p>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
