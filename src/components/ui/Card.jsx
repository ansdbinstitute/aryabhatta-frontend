import React from 'react';

const Card = ({ children, className = '', border = false }) => {
  return (
    <div className={`bg-white rounded-eight shadow-xl overflow-hidden transition hover:-translate-y-2 ${border ? 'border-2 border-ansdb-gold' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
