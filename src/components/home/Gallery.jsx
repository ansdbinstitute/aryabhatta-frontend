import React from 'react';
import { Link } from 'react-router-dom';
import { publicGalleryImages } from '../../constants/publicGalleryImages';

const Gallery = () => {
  const galleryImages = publicGalleryImages;

  return (
    <section className="py-20 px-4 md:px-10" style={{ backgroundColor: '#0A192F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-white text-4xl font-display font-bold">Life at ANSDB</h2>
            <div className="w-20 h-1 bg-accent mt-4"></div>
          </div>
          <Link to="/gallery" className="hidden md:block">
            <button className="border-2 border-accent text-accent px-6 py-3 rounded-lg font-bold hover:bg-accent hover:text-primary transition-all hover:scale-105 active:scale-95">
              View All Photos
            </button>
          </Link>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
          {/* Big image - eager load (above the fold) */}
          <div className="col-span-2 row-span-2 bg-slate-800 rounded-lg overflow-hidden border-2 border-accent/30 group">
            <img src={galleryImages[0].imgSrc} alt={galleryImages[0].alt} loading="eager" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          {/* Smaller images - lazy load (below the fold) */}
          {galleryImages.slice(1).map((img, i) => (
            <div key={i} className="bg-slate-800 rounded-lg overflow-hidden border-2 border-accent/30 group">
              <img src={img.imgSrc} alt={img.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
