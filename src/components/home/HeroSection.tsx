import React, { useRef, useEffect } from 'react';
import { ArrowRight, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCarousel from '../HeroCarousel';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays smoothly
    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play().catch(error => {
        console.error('Video playback failed:', error);
      });
    };

    // Add event listener for when video ends
    video.addEventListener('ended', handleVideoEnd);

    // Start playing the video
    video.play().catch(error => {
      console.error('Initial video playback failed:', error);
    });

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

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
    <div className="relative h-screen flex items-start pt-24 md:pt-48 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        poster="/Assests/gpr-surverys-hero-image.jpg"
      >
        <source src="/Assests/11984754_1920_1080_60fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center z-10">
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
            className="text-4xl md:text-7xl font-bold mb-6 mx-auto tracking-tight"
          >
            Leaders in Ground Penetrating Radar Surveys
          </motion.h1>
          <motion.div 
            variants={fadeInUp}
            className="mb-8"
          >
            <HeroCarousel />
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20 sm:mb-0 px-4"
          >
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4 group w-full sm:w-auto"
            >
              Get a Quote
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
            <Link
              to="/book"
              className="btn-secondary text-lg px-8 py-4 group w-full sm:w-auto"
            >
              Book a Job
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
            <Link
              to="/modify"
              className="text-lg px-8 py-4 group w-full sm:w-auto rounded-xl border border-white/60 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <span className="inline-flex items-center">
                Manage Booking
                <Edit className="ml-2 opacity-90 group-hover:opacity-100 transition-opacity" size={18} />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default HeroSection;