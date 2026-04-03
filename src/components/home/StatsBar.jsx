import React from 'react';

const stats = [
  { value: '500+', label: 'Active Students' },
  { value: '30+', label: 'Skill Courses' },
  { value: '100%', label: 'Govt. Certified' },
  { value: '2023', label: 'Established' },
];

const StatsBar = () => {
  return (
    <section className="py-12 px-4 border-y border-accent/20" style={{ backgroundColor: '#0A192F' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`text-center ${i < stats.length - 1 ? 'md:border-r border-accent/30' : ''}`}>
            <p className="text-accent text-4xl font-bold font-display">{stat.value}</p>
            <p className="text-white/80 text-sm uppercase tracking-wider mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
