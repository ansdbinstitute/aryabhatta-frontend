import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, MapPin, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import placementApi from '../../utils/placementApi';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await placementApi.getTestimonials();
        setTestimonials(data.data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, testimonials.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length, isPaused]);

  if (testimonials.length === 0 && !isLoading) return null;

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.url) return photo.url.startsWith('http') ? photo.url : `${import.meta.env.VITE_STRAPI_URL || ''}${photo.url}`;
    if (photo.data?.attributes?.url) return photo.data.attributes.url;
    return null;
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);
  const maxIndex = Math.max(0, testimonials.length - 3);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section 
      className="py-20 px-4 md:px-10" 
      style={{ backgroundColor: '#F5F8FF' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary text-4xl font-display font-bold">What Our Students Say</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-accent animate-spin"></div>
          </div>
        ) : testimonials.length === 0 ? (
          null
        ) : (
          <>
            <div className="relative overflow-hidden">
              <div
                ref={containerRef}
                className="flex gap-8 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (340 + 32)}px)` }}
              >
                {testimonials.map((testimonial, i) => {
                  const student = testimonial.student || {};
                  const profilePhoto = student.profileImage ? getPhotoUrl(student.profileImage) : null;
                  const studentName = [student.firstName, student.lastName].filter(Boolean).join(' ') || student.name || 'Anonymous';
                  const courseName = testimonial.course?.name || testimonial.course?.title || student.course?.name || student.course?.title || '';
                  const batchName = testimonial.batch?.name || student.batch?.name || '';
                  const rating = testimonial.rating || 5;
                  const text = testimonial.testimonialText || testimonial.experience || '';

                  return (
                    <div
                      key={testimonial.id || i}
                      className="flex-shrink-0 w-[340px] bg-white p-8 rounded-lg shadow-xl border-l-8 transition-all duration-300"
                      style={{ borderLeftColor: '#FFB800' }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt={studentName}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xl font-bold flex-shrink-0">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-primary truncate">{studentName}</h5>
                          {courseName && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {courseName}
                              {batchName && <span className="text-slate-400">• {batchName}</span>}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="relative mb-2">
                        <Quote className="absolute -top-1 -left-1 w-5 h-5 text-yellow-200 opacity-50" />
                        <p className="text-slate-600 text-sm leading-relaxed pl-4 line-clamp-4">
                          "{text}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {testimonials.length > 3 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goToPrev}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <div className="flex gap-2">
                  {[...Array(maxIndex + 1)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentIndex
                          ? 'bg-accent w-6'
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goToNext}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
