import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';

const AboutHero = () => {
  const parallaxRef = useParallax();

  // Fade-in animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 w-full h-full">
        <img 
          src="/Assests/pexels-willbillurban-30668000.jpg" 
          alt="GPR SURVEYS Inc." 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-wider"
          >
            About GPR Surveys
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto"
          >
            Vancouver Island's leading ground penetrating radar service
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/contact" className="btn-primary">
              Get in Touch
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="/book" className="btn-secondary">
              Book a Job
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHero;