import React, { useState, useEffect, useRef } from 'react';
import placementApi from '../utils/placementApi';
import PlacementHero from '../components/career/PlacementHero';
import PartnerCompanies from '../components/career/PartnerCompanies';
import TestimonialsGrid from '../components/career/TestimonialsGrid';

const Career = () => {
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const partnersRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [partnersData, testimonialsData] = await Promise.all([
          placementApi.getPartners(),
          placementApi.getTestimonials()
        ]);
        setPartners(partnersData.data || []);
        setTestimonials(testimonialsData.data || []);
      } catch (error) {
        console.error('Error fetching placement data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollPartners = (direction) => {
    if (partnersRef.current) {
      const scrollAmount = 340;
      partnersRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-background-light min-h-screen font-body text-slate-900">
      <PlacementHero />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          {partners.length > 0 && (
            <PartnerCompanies 
              partners={partners} 
              scrollRef={partnersRef} 
              onScroll={scrollPartners} 
            />
          )}
          
          {testimonials.length > 0 && (
            <TestimonialsGrid testimonials={testimonials} />
          )}
          
          {partners.length === 0 && testimonials.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Placement information coming soon.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Career;
