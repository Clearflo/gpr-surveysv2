import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  primaryButtonText = 'Book a Job',
  primaryButtonLink = '/book',
  secondaryButtonText = 'Get in Touch',
  secondaryButtonLink = '/contact',
  className = ''
}) => {
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
    <div 
      className={`relative min-h-[600px] flex items-center bg-center bg-cover ${className}`} 
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="max-w-3xl"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-wider"
          >
            {title}
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            {subtitle}
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to={primaryButtonLink} className="btn-primary group">
              {primaryButtonText}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link to={secondaryButtonLink} className="btn-outline">
              {secondaryButtonText}
              <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
