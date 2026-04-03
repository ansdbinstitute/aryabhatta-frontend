import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import TestimonialCard from './TestimonialCard';

const TestimonialsGrid = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const visibleCount = 3;
  const totalItems = testimonials.length;
  
  const maxIndex = Math.max(0, totalItems - visibleCount);
  const canScroll = totalItems > visibleCount;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (!canScroll || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [canScroll, isPaused, maxIndex]);

  if (!testimonials || testimonials.length === 0) return null;

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Student Success Stories
            </h2>
            <p className="text-slate-500">
              Hear from our alumni about their journey and achievements
            </p>
          </div>

          {canScroll && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 shadow-sm transition-all cursor-pointer"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {[...Array(maxIndex + 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex
                        ? 'bg-blue-600 w-6'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 shadow-sm transition-all cursor-pointer"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (340 + 16)}px)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id || index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Users className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400">
              Showing {currentIndex + 1}-{Math.min(currentIndex + visibleCount, totalItems)} of {totalItems} testimonials
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsGrid;
