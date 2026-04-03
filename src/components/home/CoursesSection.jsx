import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Mobile Repairing',
    duration: '6 Months',
    description: 'Master chip-level repairing, software troubleshooting, and hardware replacements for all major smartphone brands.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop',
    features: ['Chip-level Motherboard Repair', 'Software Flashing & Unlocking', 'Glass & Display Replacement'],
  },
  {
    id: 2,
    title: 'Web Development',
    duration: '12 Months',
    description: 'Learn to build dynamic websites and web applications from scratch using modern frameworks and technologies.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    features: ['HTML, CSS & JavaScript', 'React.js & Node.js Mastery', 'Database Management'],
  },
  {
    id: 3,
    title: 'R.A.C.W. Repairing',
    duration: '4 Months',
    description: 'Comprehensive hands-on training for domestic and commercial refrigeration and air conditioning systems.',
    image: '/images/racw_repair.png',
    features: ['Compressor Repair & Testing', 'Gas Charging & Leak Detection', 'Inverter AC Technology'],
  },
];

const CoursesSection = () => {
  return (
    <section className="py-20 px-4 md:px-10" style={{ backgroundColor: '#EEF4FF' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary text-4xl font-display font-bold">Our Professional Courses</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transition hover:-translate-y-2 border border-slate-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-accent text-primary text-xs font-black px-3 py-1 rounded-full uppercase">
                  {course.duration}
                </div>
                <h3 className="absolute bottom-3 left-4 right-4 text-white text-xl font-bold">
                  {course.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="space-y-2 mb-6">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/courses">
                  <button className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg font-bold transition-all hover:scale-105">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
