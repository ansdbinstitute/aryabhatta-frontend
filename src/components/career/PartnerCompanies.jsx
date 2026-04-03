import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import CompanyCard from './CompanyCard';

const PartnerCompanies = ({ partners, scrollRef, onScroll }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [partners]);

  useEffect(() => {
    let interval;
    if (partners.length > 4) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
          
          if (isAtEnd) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [partners.length]);

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Our Placement Partners
            </h2>
            <p className="text-slate-500">
              Leading companies and organizations that trust our graduates
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onScroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={(el) => {
            containerRef.current = el;
            if (scrollRef) scrollRef.current = el;
          }}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partners.map((partner) => (
            <CompanyCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerCompanies;
