import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white">

      {/* Bottom Footer: Links & Info */}
      <div className="text-white/70 py-16 px-4 md:px-10 border-t border-white/5" style={{ backgroundColor: '#0A192F' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="ANSDB Logo" className="h-14 w-auto bg-white p-1 rounded-sm shadow-lg" />
              <h2 className="text-white font-bold text-3xl tracking-tighter font-display">ANSDB</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-[280px]">
              Aryabhatta National Skill Development Board is committed to excellence in vocational education and training.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 group shadow-lg hover:scale-110">
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF0000] transition-all duration-300 group shadow-lg hover:scale-110">
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-3 font-heading text-lg">
              <span className="w-1 h-5 bg-ansdb-gold inline-block"></span>
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/career" className="hover:text-white transition-colors">Placements</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Franchise Form</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Verifications</Link></li>
            </ul>
          </div>

          {/* Our Courses Column */}
          <div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-3 font-heading text-lg">
              <span className="w-1 h-5 bg-ansdb-gold inline-block"></span>
              Our Courses
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/courses" className="hover:text-white transition-colors">Mobile Repairing</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Hardware Servicing</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Appliance Repair</Link></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-3 font-heading text-lg">
              <span className="w-1 h-5 bg-ansdb-gold inline-block"></span>
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-2 max-w-[250px] leading-relaxed border border-slate-700/50 p-3 border-dashed rounded bg-slate-800/20">
                <span className="text-ansdb-red">📍</span>
                Natunpukur, 2nd Rabindra Sarani Lane, Bolpur, West Bengal, 731204
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">📞</span>
                +91 90464 42337
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-300">✉️</span>
                info@ansdb.org
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                Mon-Sat: 10AM - 6PM
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>&copy; 2024 Aryabhatta National Skill Development Board. All rights reserved.</p>
          <p>Managed by Jebaankushal Foundation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
