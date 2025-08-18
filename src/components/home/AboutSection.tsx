import React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const stats = [
  { number: "10+", label: "Years Experience" },
  { number: "100%", label: "Client Satisfaction" },
  { number: "Short Notice", label: "Emergency Service" },
  { number: "Island-Wide", label: "Coverage" }
];

const AboutSection = () => {
  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 fill-blue-900/5 stroke-blue-900/5",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-6 uppercase tracking-wider relative inline-block">
              Why Choose GPR SURVEYS Inc.
              <div className="absolute left-0 bottom-0 w-3/4 h-1 bg-blue-900 md:block hidden"></div>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              With state-of-the-art technology, we provide accurate and reliable underground mapping services for projects of all sizes.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="industrial-card p-6 text-center"
                >
                  <div className="text-3xl font-display font-bold text-blue-900 mb-2">{stat.number}</div>
                  <div className="text-gray-700 font-medium tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc"
              alt="GPR Survey in action"
              className="rounded-lg shadow-xl border-2 border-[#fd8800]/10"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#fd8800] text-blue-900 p-6 rounded-lg shadow-xl">
              <p className="text-xl font-display font-bold">Licensed & Insured</p>
              <p className="text-sm">Professional liability coverage</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;