import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, ArrowRight, SearchX } from 'lucide-react';

const courseData = [
  {
    id: 1,
    title: 'Mobile Repairing',
    duration: '6 Months',
    description: 'Master chip-level repairing, software troubleshooting, and hardware replacements for all major smartphone brands.',
    category: 'Electronics',
    imgSrc: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Chip-level Motherboard Repair',
      'Software Flashing & Unlocking',
      'Glass & Display Replacement'
    ]
  },
  {
    id: 2,
    title: 'Web Development',
    duration: '12 Months',
    description: 'Learn to build dynamic websites and web applications from scratch using modern frameworks and technologies.',
    category: 'IT & Software',
    imgSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop',
    features: [
      'HTML, CSS & JavaScript',
      'React.js & Node.js Mastery',
      'Database Management (SQL/NoSQL)'
    ]
  },
  {
    id: 3,
    title: 'R. A. C. W. Repairing',
    duration: '4 Months',
    description: 'Comprehensive hands-on training for domestic and commercial refrigeration and air conditioning systems.',
    category: 'Mechanical',
    imgSrc: '/images/racw_repair.png',
    features: [
      'Compressor Repair & Testing',
      'Gas Charging & Leak Detection',
      'Inverter AC Technology'
    ]
  },
  {
    id: 4,
    title: 'Basic Computer',
    duration: '3 Months',
    description: 'Essential computer literacy skills including MS Office, internet safety, and basic hardware knowledge.',
    category: 'IT & Software',
    imgSrc: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=2070&auto=format&fit=crop',
    features: [
      'MS Office Suite Mastery',
      'Operating System Basics',
      'Internet & Email Security'
    ]
  },
  {
    id: 5,
    title: 'Python Programming',
    duration: '6 Months',
    description: 'A deep dive into Python programming from basics to advanced data science and automation applications.',
    category: 'Programming',
    imgSrc: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Core Python Syntax',
      'Data Analysis with Pandas',
      'Automating Daily Tasks'
    ]
  },
  {
    id: 6,
    title: 'AI & Machine Learning',
    duration: '12 Months',
    description: 'Unlock the future with Artificial Intelligence, Neural Networks, and deep learning algorithms.',
    category: 'Advanced IT',
    imgSrc: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Supervised & Unsupervised Learning',
      'Neural Networks & TensorFlow',
      'Natural Language Processing'
    ]
  },
  {
    id: 7,
    title: 'Internet of Things (IoT)',
    duration: '6 Months',
    description: 'Connect the world through smart devices, sensor integration, and cloud connectivity.',
    category: 'Electronics & IT',
    imgSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    features: [
      'Arduino & Raspberry Pi Basics',
      'Sensor Integration',
      'Cloud Dashboard Development'
    ]
  }
];

const CoursesListing = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courseData.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Filter/Search Bar */}
      <section className="py-8 px-6 lg:px-20 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 flex justify-center items-center border border-slate-200">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-1 focus:ring-accent focus:border-accent outline-none text-slate-900 placeholder-slate-400 transition"
              placeholder="Search courses (Electronics, IT...)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-primary text-3xl font-black mb-2 tracking-tight">Available Programs</h2>
              <p className="text-slate-500">Pick the right course to accelerate your career</p>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{filteredCourses.length} Courses Found</p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={course.title}
                      src={course.imgSrc}
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                      {course.duration}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-primary text-xl font-bold mb-3">{course.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="space-y-2 mb-6 flex-1">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className="w-full bg-danger hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Enroll Now <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <SearchX className="w-16 h-16 mx-auto opacity-50 mb-4" />
              <p className="text-xl font-bold">No courses match your criteria</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CoursesListing;
