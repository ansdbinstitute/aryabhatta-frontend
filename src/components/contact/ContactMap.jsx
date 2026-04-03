import React from 'react';
import { MapPin } from 'lucide-react';

const ContactMap = () => {
  return (
    <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white h-[400px] lg:h-full relative group">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14609.11475759715!2d87.67499999999998!3d23.6666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f979703417614d%3A0xe549646f25757962!2sBolpur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1710874000000!5m2!1sen!2sin"
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
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Natunpukur, Bolpur</p>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
