import React from 'react';
import GalleryHero from '../components/gallery/GalleryHero';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryCTA from '../components/gallery/GalleryCTA';

const Gallery = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      <GalleryHero />
      <GalleryGrid />
      <GalleryCTA />
    </div>
  );
};

export default Gallery;
