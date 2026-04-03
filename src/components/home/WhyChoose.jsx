import React from 'react';

const features = [
  { icon: '📜', title: 'Govt. Registered', desc: 'Recognized certifications across India.' },
  { icon: '👨‍🏫', title: 'Expert Faculty', desc: 'Learn from industry veterans.' },
  { icon: '🛠️', title: 'Practical Training', desc: 'Focus on 80% practical learning.' },
  { icon: '💼', title: 'Job Assistance', desc: 'Dedicated placement support.' },
];

const WhyChoose = () => {
  return (
    <section className="py-20 px-4 md:px-10" style={{ backgroundColor: '#F5F8FF' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary text-4xl font-display font-bold">Why Choose ANSDB?</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
