import React from 'react';
import { ImageOff } from 'lucide-react';
import { publicGalleryImages } from '../../constants/publicGalleryImages';

const GalleryGrid = () => {
  return (
    <>
      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 min-h-[50vh]">
        {publicGalleryImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {publicGalleryImages.map(item => (
              <div key={item.id} className="gallery-item relative overflow-hidden rounded-xl shadow-lg bg-slate-200 group cursor-pointer break-inside-avoid">
                <img
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  alt={item.alt}
                  src={item.imgSrc}
                />
                <div className="overlay absolute inset-0 bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <div className="text-center text-primary">
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{item.title}</h3>
                    <p className="text-sm font-semibold">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-20 text-slate-500">
              <ImageOff className="w-16 h-16 mx-auto opacity-50 mb-4" />
              <p className="text-xl font-bold">No images in gallery</p>
            </div>
        )}
      </main>
    </>
  );
};

export default GalleryGrid;
