import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, ArrowRight, SearchX } from 'lucide-react';
import { publicCourses } from '../../constants/publicCourses';

const CoursesListing = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = publicCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Filter/Search Bar */}
      <section className="py-6 md:py-8 px-4 md:px-6 -mt-8 md:-mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-3 md:p-4 flex justify-center items-center border border-slate-200">
          <div className="relative w-full">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-400" />
            <input
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-slate-200 bg-slate-50 focus:ring-1 focus:ring-accent focus:border-accent outline-none text-slate-900 placeholder-slate-400 transition text-sm md:text-base"
              placeholder="Search courses (Electronics, IT...)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section className="py-10 md:py-16 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-primary text-2xl md:text-3xl font-black mb-2 tracking-tight">Available Programs</h2>
              <p className="text-slate-500 text-sm md:text-base">Pick the right course to accelerate your career</p>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{filteredCourses.length} Courses Found</p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col hover:-translate-y-1">
                  <div className="relative h-44 md:h-56 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={course.title}
                      src={course.imgSrc}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-primary text-lg md:text-xl font-bold mb-2 md:mb-3">{course.title}</h3>
                    <p className="text-slate-500 text-sm mb-3 md:mb-4 line-clamp-2">{course.description}</p>
                    <div className="space-y-1 md:space-y-2 mb-4 md:mb-6 flex-1">
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
