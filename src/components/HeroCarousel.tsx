import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Content-only hero helper. This intentionally renders no background so that
// the homepage hero background is controlled solely by HeroSection.
const facts = [
  {
    title: 'Professional Team',
    description: "Serving Vancouver Island's GPR industry with excellence",
  },
  {
    title: 'Proven Results',
    description: 'Precision mapping with advanced GPR technology',
  },
  {
    title: 'Emergency Service',
    description: 'Short Notice / Emergency Service Available',
  },
  {
    title: 'Island-Wide Coverage',
    description:
      'Victoria-based, proudly serving Vancouver Island, the Gulf Islands, Greater Vancouver, and all of BC',
  },
  {
    title: 'Certified Experts',
    description: 'Professional team with extensive GPR certification',
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            {facts[currentIndex].title}
          </h2>
          <p className="text-lg text-gray-200 text-center">
            {facts[currentIndex].description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;