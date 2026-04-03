import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-ansdb-red hover:bg-red-700 text-white shadow-xl',
    outline: 'border-2 border-ansdb-gold text-ansdb-gold hover:bg-ansdb-gold hover:text-ansdb-navy',
    navy: 'bg-ansdb-navy hover:bg-ansdb-royal text-white',
  };

  return (
    <button
      className={`px-8 py-3 rounded-eight font-bold transition uppercase text-sm ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
