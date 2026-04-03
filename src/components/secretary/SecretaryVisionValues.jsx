import React from 'react';
import { Shield, Star, Zap } from 'lucide-react';

const SecretaryVisionValues = () => {
  return (
    <section className="bg-primary py-24 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Core Values We Champion</h2>
          <div className="mt-4 h-1 w-20 bg-accent mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group rounded-2xl bg-white/5 p-8 text-center transition-all hover:bg-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="mb-4 text-xl font-bold">Integrity</h3>
            <p className="text-slate-400">Maintaining the highest ethical standards in every training module and certification process.</p>
          </div>
          <div className="group rounded-2xl bg-white/5 p-8 text-center transition-all hover:bg-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="mb-4 text-xl font-bold">Excellence</h3>
            <p className="text-slate-400">Striving for pedagogical perfection through continuous curriculum updates and industry collaboration.</p>
          </div>
          <div className="group rounded-2xl bg-white/5 p-8 text-center transition-all hover:bg-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="mb-4 text-xl font-bold">Empowerment</h3>
            <p className="text-slate-400">Transforming lives by giving individuals the skills to create their own destinies and careers.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecretaryVisionValues;
