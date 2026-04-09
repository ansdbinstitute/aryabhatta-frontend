import React from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryCTA from '../components/gallery/GalleryCTA';
import Seo from '../components/common/Seo';

const Gallery = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      <Seo
        title="ANSDB Gallery | Skill Development Institute in Bolpur"
        description="See life at ANSDB through classrooms, labs, and practical training images from a leading skill development institute in Bolpur."
        path="/gallery"
        keywords={[
          'ANSDB',
          'Aryabhatta National Skill Development Board',
          'skill development institute in Bolpur',
          'vocational training in Bolpur',
        ]}
      />
      <GalleryHero />
      <GalleryGrid />
      <GalleryCTA />
    </div>
  );
};

export default Gallery;
