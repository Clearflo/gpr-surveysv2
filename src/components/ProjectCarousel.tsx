import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const TRANSITION_DURATION = 0.4;
const AUTO_ADVANCE_DELAY = 4000;
const PAUSE_DELAY = 5000;

interface Project {
  image: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

// This is a temporary single project placeholder
// More projects can be added here in the future
const projects: Project[] = [
  {
    image: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    title: "Featured Projects Coming Soon",
    description: "We're currently documenting our most impactful GPR surveys and subsurface detection projects. Check back soon to explore our growing portfolio.",
    category: "Portfolio",
    link: "/projects"
  }
];

const ProjectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  }, []);

  const handleNavigation = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setLastInteraction(Date.now());
  };

  useEffect(() => {
    // Resume auto-advance after inactivity
    if (!isPaused && Date.now() - lastInteraction > PAUSE_DELAY) {
      const timer = setInterval(nextSlide, AUTO_ADVANCE_DELAY);
      return () => clearInterval(timer);
    }
  }, [isPaused, nextSlide, lastInteraction]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: TRANSITION_DURATION, ease: "easeInOut" },
            opacity: { duration: TRANSITION_DURATION * 0.75, ease: "easeInOut" }
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            <img
              src={projects[currentIndex].image}
              alt={projects[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/50"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-4 py-1 bg-blue-900 text-white text-sm rounded-full mb-4">
                {projects[currentIndex].category}
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">
                {projects[currentIndex].title}
              </h3>
              <p className="text-gray-200 mb-4">
                {projects[currentIndex].description}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to={projects[currentIndex].link}
                  className="inline-flex items-center text-white hover:text-blue-200 transition-colors duration-300"
                >
                  View Projects
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <div className="flex items-center text-gray-300 text-sm">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8 scale-100' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProjectCarousel;