import React from 'react';

const TrustCards = () => {
  const cards = [
    'ISO Certified',
    'MSME Certified',
    'MCA Registered',
    'Most Trusted'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-16 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((text, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-t-4 border-ansdb-gold flex items-center justify-center min-h-[140px] transform hover:-translate-y-1.5 transition-all duration-300"
          >
            <span className="text-[#0B1324] font-bold text-xl tracking-tight leading-tight">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustCards;
