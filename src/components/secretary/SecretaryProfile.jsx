import React from 'react';

const SecretaryProfile = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-start">
          {/* Left: Portrait */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-3xl border-2 border-accent/30 translate-x-4 translate-y-4 -z-10"></div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border-[12px] border-white shadow-2xl">
              <img 
                className="h-full w-full object-cover" 
                alt="Professional portrait of A. Ghosh in business suit" 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-xl shadow-xl">
              <p className="text-primary font-black text-xl italic font-serif">A. Ghosh</p>
            </div>
          </div>
          
          {/* Right: Message Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-accent uppercase">Leadership</span>
              <h2 className="mt-2 text-4xl font-bold text-primary">A Vision for Empowered Youth</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-slate-600">
              <p>
                At ANSDB, our mission is deeply rooted in the belief that skill development is the most potent tool for national transformation. Registered with <span className="font-bold">MCA</span>, we align our pedagogical approaches with the national vision of 'Atmanirbhar Bharat'.
              </p>
              <p>
                Vocational training is no longer a secondary option; it is the backbone of India's economic future. We are committed to bridging the gap between traditional education and industry requirements, ensuring that every student who passes through our doors is not just certified, but truly competent.
              </p>
              <p>
                Integrity and excellence are the cornerstones of our institution. We invite you to join us in this journey of creating a skilled, confident, and self-reliant India.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-4">Official Endorsement</p>
              <div className="font-serif text-3xl text-primary opacity-80 italic">
                A. Ghosh
              </div>
              <p className="mt-2 text-accent font-bold">Secretary, ANSDB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecretaryProfile;
