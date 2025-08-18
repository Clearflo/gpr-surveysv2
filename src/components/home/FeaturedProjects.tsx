import React from 'react';
import { motion } from 'framer-motion';
import ProjectCarousel from '../ProjectCarousel';

const FeaturedProjects = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-4 uppercase tracking-wider">
            Featured Projects
          </h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our recent GPR survey projects and success stories
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <ProjectCarousel />
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedProjects;