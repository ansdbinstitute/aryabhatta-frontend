import React from 'react';
import { Bell } from 'lucide-react';

const NoticeHero = () => {
  const handleNotifyMe = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('ANSDB Notifications', {
          body: 'You are successfully subscribed to the latest public notices and updates!',
          icon: '/favicon.png'
        });
      }
    });
  };

  return (
    <section 
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1248BB 50%, #0A192F 100%)' }}
    >
      {/* Decorative Diagonal Pattern (CSS approximated with SVG/Gradients) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-stripe" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="50" height="100" fill="#1248BB"></rect>
              <rect width="50" height="100" fill="transparent" transform="translate(50,0)"></rect>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-stripe)"></rect>
        </svg>
      </div>

      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#1248BB]/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h1 className="text-white text-5xl lg:text-7xl font-black font-display leading-tight mb-6">
          Public Notices <span className="text-accent">&amp;</span> Announcements
        </h1>
        <p className="text-blue-100/80 text-lg lg:text-xl max-w-3xl mx-auto font-medium">
          Stay updated with the latest news, exam schedules, and official board announcements from Aryabhatta National Skill Development Board.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
            className="bg-accent text-primary hover:brightness-105 px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            onClick={handleNotifyMe}
          >
            <Bell className="w-5 h-5" />
            Latest Updates
          </button>
        </div>
      </div>
    </section>
  );
};

export default NoticeHero;
