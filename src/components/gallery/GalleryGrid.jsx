import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const galleryData = [
  {
    id: 1,
    title: 'Coding Labs',
    description: 'State-of-the-art infrastructure for software development.',
    category: 'Labs',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZVzheqB23AsHiz68KU6gVUzX3Chq9MGUzVVvP6G9n8kxUghGyPfGcRzrPYMKyh4-J1cZTrGhp1ViHs9XueSajm5_LVq3zCrYYbLiewu2aAv_3tbpl5kTb3iSbSwyQwMOKMz2hlAaSmLyLKj58N68Z72hW4K7aCwxR7lxUoa9LufMBsTMGr5xOfYlR-s0jEgX9L6FOIj6jRNw6bQCAP5rNS7eP7QkWZ3A0-M92jP6eFOkf0_5gFkc_tenezlC1cdfAaiRoCIbf3Q',
    alt: 'Students working in a modern coding lab',
  },
  {
    id: 2,
    title: 'Mobile Repairing',
    description: 'Hands-on practical session on circuit diagnostics.',
    category: 'Workshops',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJJSxWPZkz_MYPR54Qx_e7RiFe5O1fSH7cZGqbQB-uLeL0ZAM_stt7LrIup8611GRYR031CEO09Qy8WLCIPlU3OxTxmQHmWzw_gMOrltOUFfYhdiDODkC2VQm2WE63Ipe7cUkvWO1fnUTjDYQA1qaHSybyd85yh9fBsMKLIZsg2lrBLJeJFt5P_9Atqu5f5Ak5sE2vGuA-dHKzqDgeTH8TvWX7ef9EdLAuGuUr2c-sjOJrSsE5EI0ineXsWLUFV2duW-39YcrL1Aw',
    alt: 'Technicians performing mobile repairing workshop',
  },
  {
    id: 3,
    title: 'AC Repair Training',
    description: 'Professional HVAC maintenance and repair workshops.',
    category: 'Workshops',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFRMOSqC3FUPpkWwUcvsJhd8wISAdO4T1Zicr-sEZawiBljGBCqeZ01XxwxzeyBTaHoMnD33lUl1W9jf8bCAp5NnyzBqQ9AX7YpJZxw-7Dn_xvAb0s9lRBRYG3QHZD_-kIHycPNXzODVqX9b-eodnDgk5NsN9EcA3efcw9383psY1RwEg3t7D66VVGxushT6eUJpDN5OidT_ORA29eeYQSBEE3W3xWCwGxu1ZTbQ8u9k5tZKvFiu6yGb4LJdI91zcmaDbg02IU-H4',
    alt: 'Technician working on an AC unit repair',
  },
  {
    id: 4,
    title: 'Theoretical Sessions',
    description: 'Focused learning environments with industry experts.',
    category: 'Classrooms',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXB2uSvUVsUxBIsP_pLaKvHKEoSqXhQv3EaXwLVTmoF6S2RNtAhwj_KzLlPzWXb0G5I0De08wEQxVgiOzGfnS-chi0GnzfEMErV4YoXDaSDpIXELpOgXbnVWd_p0wyiXaJkaEtZELM3EiU27A04u_GGvwJEVW8i6arb9RPba_YXtsB7ZQChhAR8QxsPZaWso_Dm9HLLwM-eT3BpbmMPGCsBMJ81Fs6ce-KZQOd0H5T-HuUtnV4CboZofWNn-SXpvlbzM_XOh1fvJ8',
    alt: 'Students attending a classroom lecture',
  },
  {
    id: 5,
    title: 'Graduation Day',
    description: 'Celebrating the success of our certified professionals.',
    category: 'Events',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnEst7GG4vztF3u_BOJgnKKp9YIhD8o8DGuZixMQ9WoFWb2s9rdqidFR-piiB0AFBvwyy7Dy_LW_5X1RWvRU4WQcybj5cFjxKw8QpKSKRUSAOY4G8MH5mT6-sIFhWHnwwiGlqacSvQs6hCogvLvThN3x-AB0yXvlxoFH3mbO15pp2068XPQe6HoU2uyee1m85oCIdPoIEcqEVyumqvG_ntJAr98sgnt8ZXirt65Psq0IVlgJdrpA1dvqIOfk1kiIXGBOuutWBc18',
    alt: 'Graduation ceremony with students in caps and gowns',
  },
  {
    id: 6,
    title: 'Industrial Visits',
    description: 'Bridging the gap between classroom and industry.',
    category: 'Events',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvMaxKDsZ66xhBLkyap6W0w5ai_l4Acgp3momzoc-9RDxogSVCgWovI8nnNttLNPoAiVScOLJIHzSdBA_4RFkS0az3ml4lyjldDAdJEEQUW-GE_5FwSneEbRGJi9q2xqDx1IcJl-ZISHTobHZquCjkkexUXihWr_YnxH6iPpES7O4-4mPjOyfIADEguqQP1nxcn1mDFSfH4hOVylQ_fRV8EOTDDAMte5XD1GvBIoHVqnjXGKCpr46NUbuo1F2JkD2PWaMwLHPlyro',
    alt: 'Industrial visit to a manufacturing plant',
  },
  {
    id: 7,
    title: 'Electronics Labs',
    description: 'Advanced component testing and board repair.',
    category: 'Labs',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy981gZrx9PhmMRFkwb8aoB8EfHiJ1ooyh84MnmTlKBHnibz_mW05DOP3WGJx2KxIeC1l_849EBeQlvUmAl8c8IH4SB-nseQMXUza4Z_4wFMDnWFK9b_AtLF-pJYeNmKl8NDJbwl6xe63s97QtQx5jwXkDCjSPgK8ie-r6Ozy9bMQ-Hh1a7QwJXIdn21a6djirw9o_BubUIY3GzzhOIThQNsRqLZCzodM_kzbsgLLufhKZ9Uk0otr6f81fJHkWV_PlKMZuR_dEYRg',
    alt: 'Hands-on electronics lab session',
  },
  {
    id: 8,
    title: 'Coding Class',
    description: 'Students engaged in hands-on programming sessions.',
    category: 'Classrooms',
    imgSrc: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    alt: 'Coding Class',
  },
  {
    id: 9,
    title: 'Hardware Repair',
    description: 'Detailed practical training on computer hardware.',
    category: 'Workshops',
    imgSrc: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80',
    alt: 'Hardware Repair',
  },
  {
    id: 10,
    title: 'Circuit Board',
    description: 'Advanced electronics design and testing.',
    category: 'Labs',
    imgSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    alt: 'Circuit Board',
  },
  {
    id: 11,
    title: 'Computer Lab',
    description: 'Fully equipped modern computing facilities.',
    category: 'Labs',
    imgSrc: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80',
    alt: 'Computer Lab',
  },
  {
    id: 12,
    title: 'Technical Work',
    description: 'Practical field training and equipment maintenance.',
    category: 'Workshops',
    imgSrc: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80',
    alt: 'Technical Work',
  }
];

const filters = ['All', 'Classrooms', 'Labs', 'Workshops', 'Events', 'Certifications'];

const GalleryGrid = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = galleryData.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-[#EEF4FF] text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 min-h-[50vh]">
        {filteredItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map(item => (
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
              <p className="text-xl font-bold">No images found for "{activeFilter}"</p>
            </div>
        )}
      </main>
    </>
  );
};

export default GalleryGrid;
