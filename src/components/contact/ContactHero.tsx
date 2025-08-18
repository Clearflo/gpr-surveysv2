import React from 'react';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

export const ContactHero = () => {
  return (
    <div className="bg-blue-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
      <GridPattern
        width={20}
        height={20}
        className={cn(
          "absolute inset-0 fill-white/10 stroke-white/10",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Get in touch with our team to discuss your project requirements</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Contact Us by Email or Phone for Rates
          </p>
        </div>
      </div>
    </div>
  );
};
