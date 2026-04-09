import React, { useState, useEffect, useRef } from 'react';
import placementApi from '../utils/placementApi';
import PlacementHero from '../components/career/PlacementHero';
import PartnerCompanies from '../components/career/PartnerCompanies';
import TestimonialsGrid from '../components/career/TestimonialsGrid';
import Seo from '../components/common/Seo';

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
      <Seo
        title="ANSDB Placements in Bolpur | Career Support"
        description="Explore ANSDB placement support, hiring partners, and student success stories from a leading vocational training institute in Bolpur."
        path="/career"
        keywords={[
          'ANSDB',
          'Aryabhatta National Skill Development Board',
          'vocational training in Bolpur',
          'best institute in Bolpur',
        ]}
      />
      <PlacementHero />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <PartnerCompanies 
            partners={partners} 
            scrollRef={partnersRef} 
            onScroll={scrollPartners} 
          />
          
          {testimonials.length > 0 && (
            <TestimonialsGrid testimonials={testimonials} />
          )}
          
          {testimonials.length === 0 && (
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